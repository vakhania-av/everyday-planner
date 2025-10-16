<?php

class PasswordResetController extends BaseController {
  /**
   * @var User
   */
  private $userModel;
  /**
   * @var PasswordReset
   */
  private $passwordResetModel;

  public function __construct($userModel, $passwordResetModel, $logger = null) {
    parent::__construct();
    $this->userModel = $userModel;
    $this->passwordResetModel = $passwordResetModel;
  }

  public function handle(): void {
    // Проверка метода запроса
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
      throw new ValidationException('Method not allowed', 405);
    }

    $data = $this->getJsonInput();

    // Валидация входных данных
    if (empty($data['token']) || empty($data['password'])) {
      throw new ValidationException('Token and password are required');
    }

    if (strlen($data['password']) < 6) {
      throw new ValidationException('Password must be at least 6 characters');
    }

    $resetRecord = $this->passwordResetModel->findByToken($data['token']);

    if (!$resetRecord) {
      throw new ValidationException('Invalid or expired reset token');
    }

    // Поиск пользователя по email из токена
    $user = $this->userModel->findByEmail($resetRecord['email']);

    if (!$user) {
      throw new ValidationException('User not found');
    }

    // Обновление пароля
    if (!$this->userModel->updatePassword($user['id'], $data['password'])) {
      throw new ServiceException('Failed to update password');
    }

    // Удаление неиспользованного токена
    $this->passwordResetModel->deleteToken($data['token']);

    $this->respondSuccess('Password has been reset successfully');
  }
}

?>