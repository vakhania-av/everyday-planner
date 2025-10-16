<?php
require_once __DIR__ . '/../lib/Database.php';

// Модель для работы с токенами
class PasswordReset {
  private $db;

  public function __construct() {
    $this->db = (new Database())->getConnection();
  }

  public function createToken($email, $token, $expiresAt) {
    $statement = $this->db->prepare("INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)");

    return $statement->execute([$email, $token, $expiresAt]);
  }

  public function findByToken($token) {
    $statement = $this->db->prepare("SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()");
    $statement->execute([$token]);

    return $statement->fetch();
  }

  public function deleteByEmail($email) {
    $statement = $this->db->prepare("DELETE FROM password_resets WHERE email = ?");

    return $statement->execute([$email]);
  }


  public function deleteToken($token) {
    $statement = $this->db->prepare("DELETE FROM password_resets WHERE token = ?");

    return $statement->execute([$token]);
  }

  public function cleanupExpired() {
    $statement = $this->db->prepare("DELETE FROM password_resets WHERE expires_at <= NOW()");

    return $statement->execute();
  }
}
?>