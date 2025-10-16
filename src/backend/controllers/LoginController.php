<?php

class LoginController extends BaseController {
  use CsrfValidationTrait;

  /**
   * @var Auth
   */
  private $auth;

  public function __construct($auth, $logger = null) {
    parent::__construct();
    $this->auth = $auth;
  }

  public function handle(): void {
    // Проверка метода запроса
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
      throw new ValidationException('Method not allowed', 405);
    }

    $this->validateCsrfToken();

    $data = $this->getJsonInput();

    // Валидация обязательных полей (электронная почта и пароль)
    if (empty($data['email']) || empty($data['password'])) {
      throw new ValidationException('Email and password are required');
    }

    // Попытка аутентификации
    $result = $this->auth->login($data['email'], $data['password']);

    // Успешный вход
    $this->respondJson([
      'message' => 'Login successful',
      'user' => $result['user'],
      'csrf_token' => $this->getCsrfToken()
    ], 200);
  }
}

?>