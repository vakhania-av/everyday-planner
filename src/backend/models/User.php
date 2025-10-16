<?php
require_once __DIR__ . '/../lib/Database.php';

// Модель пользователя
class User {
  private $db;

  public function __construct() {
    $this->db = (new Database())->getConnection();
  }

  public function create($username, $email, $password) {
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $statement = $this->db->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
    $statement->execute([$username, $email, $hashedPassword]);

    return $this->db->lastInsertId();
  }

  public function findByEmail($email) {
    $statement = $this->db->prepare("SELECT * FROM users WHERE email = ?");
    $statement->execute([$email]);

    return $statement->fetch();
  }

  public function findById($userId) {
    $statement = $this->db->prepare("SELECT * FROM users WHERE id = ?");
    $statement->execute([$userId]);

    return $statement->fetch();
  }

  public function findByResetToken($token) {
    $passwordResetModel = new PasswordReset();
    $resetRecord = $passwordResetModel->findByToken($token);

    if (!$resetRecord) {
      return null;
    }

    return $this->findByEmail($resetRecord['email']);
  }

  public function verifyPassword($user, $password) {
    return password_verify($password, $user['password_hash']);
  }

  public function updatePassword(int $userId, string $newPassword): ?array {
    $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
    $statement = $this->db->prepare("UPDATE users SET password_hash = ? WHERE id = ?");

    return $statement->execute([$hashedPassword, $userId]);
  }

  public function updateProfile(int $userId, string $name, string $email): ?array {
    $statement = $this->db->prepare("UPDATE users SET username = ?, email = ? WHERE id = ?");
    
    if (!$statement->execute([$name, $email, $userId])) {
      error_log("DB execute failed: " . $statement->error);

      return null;
    }

    // Возвращаем обновлённые данные
    return $this->findById($userId);
  }
}
?>