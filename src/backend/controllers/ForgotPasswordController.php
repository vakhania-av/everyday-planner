<?php

class ForgotPasswordController extends BaseController {
  use CsrfValidationTrait;

  /**
   * @var UserModel
   */
  private $userModel;
  /**
   * @var PasswordResetModel
   */
  private $passwordResetModel;
  /**
   * @var Mailer
   */
  private $mailer;

  public function __construct($userModel, $passwordResetModel, $mailer, $logger = null) {
    parent::__construct();
    $this->userModel = $userModel;
    $this->passwordResetModel = $passwordResetModel;
    $this->mailer = $mailer;
  }

  public function handle(): void {
    // Разрешаем только POST-запросы
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
      throw new ValidationException('Method not allowed', 405);
    }

    $this->validateCsrfToken(); // CSRF для публичной формы

    $data = $this->getJsonInput();

    if (empty($data['email'])) {
      throw new ValidationException('Email is required');
    }

    // Проверяем, существует ли пользователь
    $user = $this->userModel->findByEmail($data['email']);

    // Защита от перебора: всегда ведём себя одинаково
    if (!$user) {
      $this->simulateDelay();
      $this->respondSuccess('If the email exists, reset instructions have been sent');

      return;
    }

    // Генерация токена сброса
    $resetToken = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', time() + 3600); // 1 час

    // Сохранение токена в базу данных
    if (!$this->passwordResetModel->createToken($data['email'], $resetToken, $expiresAt)) {
      throw new ServiceException('Failed to create reset token');
    }

    // Отправка письма
    $result = $this->mailer->sendPasswordReset($data['email'], $resetToken);

    if (!$result) {
      error_log("Failed to send password reset email to: {$data['email']}");
      // Не прерываем выполнение - пользователь всё равно получит сообщение об успехе (намеренно не сообщаем об ошибке - для безопасности)
    }

    // Успешный ответ (даже если письмо не отправилось)
    $this->respondSuccess('If the email exists, reset instructions have been sent', $result);
  }
}

?>