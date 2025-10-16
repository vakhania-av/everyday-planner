<?php
require_once __DIR__ . '/../config/db.php';

// Класс для работы с БД
class Database {
  private $pdo;

  public function __construct() {
    $connection = DatabaseConfig::$driver . ":host=" . DatabaseConfig::$host . ";dbname=" . DatabaseConfig::$dbname . ";charset=" . DatabaseConfig::$charset;
    $options = [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES => false
    ];

    try {
      $this->pdo = new PDO($connection, DataBaseConfig::$username, DataBaseConfig::$password, $options);
    } catch (PDOException $Exception) {
      throw new PDOException($Exception->getMessage(), (int)$Exception->getCode());
    }
  }

  public function getConnection() {
    return $this->pdo;
  }
}
?>