<?php
// Настройки базы данных MySQL
class Database {
  private $host = $_ENV['DB_HOST'];
  private $user = $_ENV['DB_USER'];
  private $password = $_ENV['DB_PASSWORD'];
  private $database = $_ENV['DB_NAME'];

  public $conn;

  public function __construct() {
    // Создаём соединение
    $this->conn = new mysqli($this->host, $this->user, $this->password, $this->database);

    // Проверяем подключение
    if ($this->conn->connect_error) {
      die("Ошибка подключения: " . $this->conn->connect_error);
    }
  }

  // Можно добавить методы для запросов
  public function query($sql) {
    return $this->conn->query($sql);
  }

  // Закрываем соединение
  public function close() {
    $this->conn->close();
  }
}
?>