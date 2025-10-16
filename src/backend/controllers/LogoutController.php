<?php

class LogoutController extends BaseController {
  use CsrfValidationTrait;

  /**
   * @var Auth;
   */
  private $auth;

  public function __construct($auth, $logger = null) {
    parent::__construct();
    $this->auth = $auth;
  }

  public function handle(): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
      throw new ValidationException('Method not allowed', 405);
    }

    $this->validateCsrfToken();

    // Выполняем выход
    $this->auth->logout();

    // Инвалидация CSRF-токена при выходе
    unset($_SESSION['csrf_token']);
    //CsrfService::refreshToken();

    // Возвращаем успешный ответ
    $this->respondSuccess('Logout successful');
  }
}

?>