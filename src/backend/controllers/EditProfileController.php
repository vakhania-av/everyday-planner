<?php

class EditProfileController extends BaseController {
  use CsrfValidationTrait;

  private $auth;
  private $userModel;

  public function __construct($auth, $userModel, $logger = null) {
    parent::__construct();
    $this->auth = $auth;
    $this->userModel = $userModel;
  }

  private function getUserData() {
    $input = $this->getJsonInput();
    // Извлекаем данные (на фронтенде отправляется { data: { ... } })
    return $input['data'] ?? [];
  }

  private function validateUserData() {
    $userData = $this->getUserData();

    // Валидация
    $name = trim($userData['name'] ?? '');
    $email = trim($userData['email'] ?? '');

    if (empty($name)) {
      throw new ValidationException('Name is required');
    }

    if (empty($email)) {
      throw new ValidationException('Email is required');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      throw new ValidationException('Invalid email format');
    }

    return [
      'name' => $name,
      'email' => $email
    ];
  }

  protected function updateSession($updatedUser) {
    $_SESSION['user_name'] = $updatedUser['name'];
    $_SESSION['user_email'] = $updatedUser['email'];
  }

  protected function handle(): void {
    // Только PUT-запросы
    if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
      throw new ValidationException('Method not allowed', 405);
    }

    // Проверка аутентификации
    $authStatus = $this->auth->checkAuth();

    if (!$authStatus['authenticated']) {
      throw new ValidationException('Unathorized', 401);
    }

    // Проверка CSRF-токена
    $this->validateCsrfToken();

    $userId = $_SESSION['user_id'];
    $currentEmail = $_SESSION['user_email'] ?? null;

    // Валидируем данные пользователя
    $data = $this->validateUserData();

    // Проверяем уникальность email (если email изменился)
    if ($data['email'] !== $currentEmail) {
      if ($this->userModel->findByEmail($data['email'])) {
        throw new ValidationException('Email is already taken');
      }
    }

    // Обновление в БД
    $updatedUser = $this->userModel->updateProfile($userId, $data['name'], $data['email']);

    if (!$updatedUser) {
      throw new ServiceException('Failed to update profile');
    }

    // Обновление сессии
    $this->updateSession($updatedUser);

    // Возвращаем обновлённого пользователя
    $this->respondSuccess('Profile updated successfully', [
      'user' => [
        'id' => $updatedUser['id'],
        'name' => $updatedUser['username'],
        'email' => $updatedUser['email']
      ]
    ]);
  }
}

?>