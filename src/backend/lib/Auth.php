<?php

require_once __DIR__ . '/../exceptions/ValidationException.php';
require_once __DIR__ . '/../exceptions/AuthException.php';
require_once __DIR__ . './../exceptions/ServiceException.php';

require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/../models/User.php';

/**
 * Класс обработки аутентификации
 */
class Auth {
  /**
   * @var UserModel
   */
  private $userModel;

  public function __construct() {
    $this->userModel = new User();
  }

  /**
   * Регистрация нового пользователя
   * @throws ValidationException
   * @throws ServiceException
   */
  public function register(string $name, string $email, string $password): array { 
    // Проверка существования пользователя
    if ($this->userModel->findByEmail($email)) {
      throw new ValidationException('Пользователь с таким email уже существует');
    }

    try {
      // Создание пользователя
      $userId = $this->userModel->create($name, $email, $password);
      // Автоматический вход после регистрации
      $user = $this->userModel->findById($userId);

      if (!$user) {
        throw new ServiceException('Не удалось создать пользователя');
      }

      $this->startSession($user);

      return ['user' => [
        'id' => $user['id'],
        'name' => $user['username'],
        'email' => $user['email']
      ]];
    } catch (PDOException $err) {
      error_log("Auth::register failed: " . $err->getMessage());
      throw new ServiceException('Ошибка при регистрации');
    }
  }

  /**
   * Аутентификация пользователя
   * @throws AuthException
   */
  public function login(string $email, string $password): array {
    $user = $this->userModel->findByEmail($email);

    if (!$user) {
      throw new AuthException('User not found', 401);
    }

    if (!$this->userModel->verifyPassword($user, $password)) {
      throw new AuthException('Incorrect password', 401);
    }

    $this->startSession($user);

    return ['user' => [
        'id' => $user['id'],
        'name' => $user['username'],
        'email' => $user['email']
      ]];
  }

  /**
   * Завершение сессии
   */
  public function logout(): void {
    if (session_status() === PHP_SESSION_ACTIVE) {
      $_SESSION = [];

      if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(
          session_name(),
          '',
          time() - 42000,
          $params['path'],
          $params['domain'],
          $params['secure'],
          $params['httponly']
        );
      }

      session_destroy();
    }
  }

  /**
   * Проверка аутентификации (Текущего статуса аутентификации)
   * @return array Текущий авторизованный пользователь | null
   */
  public function checkAuth(): array {
    if (!isset($_SESSION['user_id'])) {
      return ['authenticated' => false];
    }

    $user = $this->userModel->findById($_SESSION['user_id']);

    if (!$user) {
      return ['authenticated' => false];
    }

    return [
      'authenticated' => true,
      'user' => [
        'id' => $user['id'],
        'name' => $user['username'],
        'email' => $user['email']
      ]
    ]; 
  }

  /**
   * Запуск сессии пользователя (Безопасная инициализация сессии)
   */
  public function startSession(array $user): void {
    if (session_status() !== PHP_SESSION_ACTIVE) {
      session_start();
    }

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_name'] = $user['username'];
    $_SESSION['last_activity'] = time();

    // Защита от фиксации сессии
    session_regenerate_id(true);
  }

  /**
   * Проверка прав доступа к задаче
   * @throws AuthException
   */
  public function checkTodoOwnership(int $todoId): bool {
    if (!isset($_SESSION['user_id'])) {
      return false;
    }

    $db = (new Database())->getConnection();
    $statement = $db->prepare("SELECT user_id FROM todos WHERE id = ?");
    $statement->execute([$todoId]);
    $todo = $statement->fetch();

    return ($todo && (int)$todo['user_id'] === (int)$_SESSION['user_id']);
  }
}

?>