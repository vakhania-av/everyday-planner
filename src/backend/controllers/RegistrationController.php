<?php

class RegistrationController extends BaseController {
  use CsrfValidationTrait;

  /**
   * @var Auth
   */
  private $auth;
  /**
   * @var ValidationService
   */
  private $validator;

  public function __construct(Auth $auth, ValidationService $validator, $logger = null) {
    parent::__construct($logger);
    $this->auth = $auth;
    $this->validator = $validator;
  }

  public function handle(): void {
    // Разрешаем только POST-запросы
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
      throw new ValidationException('Method not allowed', 405);
    }

    // Валидация CSRF через трейт
    $this->validateCsrfToken();

    $data = $this->getJsonInput();

    // Валидация через сервис
    $this->validator->validateRequired($data, ['name', 'email', 'password']);
    $this->validator->validateName($data['name']);
    $this->validator->validateEmail($data['email']);
    $this->validator->validatePassword($data['password']);

    $result = $this->auth->register($data['name'], $data['email'], $data['password']);

    // Успешная регистрация
    $this->respondJson([
      'message' => 'Registration successful',
      'user' => $result['user'],
      'csrf_token' => $this->getCsrfToken() // из трейта
    ], 201);
  }
}

?>