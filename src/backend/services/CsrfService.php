<?php

/**
 * Класс, реализующий CSRF сервис
 */
class CsrfService {
  private static $tokenLength = 32;

  /**
   * Генерация CSRF-токена (служебная)
   */
  public static function generateToken() {
    return bin2hex(random_bytes(self::$tokenLength));
  }

  /**
   * Проверка CSRF-токена
   * @param $token - CSRF-токен
   */
  public static function validateToken($token) {
    if (empty($token) || empty($_SESSION['csrf_token'])) {
      return false;
    }

    return hash_equals($_SESSION['csrf_token'], (string)$token);
  }

  /**
   * Получение существующего или создание нового CSRF-токена
   */
  public static function getToken() {
    if (empty($_SESSION['csrf_token'])) {
      $_SESSION['csrf_token'] = self::generateToken();
    }

    return $_SESSION['csrf_token'];
  }

  /**
   * Принудительная генерация нового CSRF-токена
   */
  public static function refreshToken() {
    $_SESSION['csrf_token'] = self::generateToken();

    return $_SESSION['csrf_token'];
  }
}

?>