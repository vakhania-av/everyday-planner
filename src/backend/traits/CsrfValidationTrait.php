<?php

require_once __DIR__ . '/../services/CsrfService.php';

/**
 * Трейт для валидации CSRF-токена
 * Предполагает, что класс имеет свойство $auth с методами validateCsrf()
 */
trait CsrfValidationTrait {
  protected function validateCsrfToken() {
    $token = $this->getCsrfTokenFromRequest();

    if (!CsrfService::validateToken($token)) {
      error_log("Invalid CSRF token provided for {$_SERVER['REMOTE_ADDR']}");
      
      throw new ValidationException('CSRF token validation failed');
    }
  }

  protected function getCsrfTokenFromRequest() {
    // Проверяем заголовки
    $headers = getallheaders();
    $token = $headers['x-csrf-token'] ?? null;

    // Если нет в заголовках проверяем тело запроса
    if (!$token) {
      throw new ValidationException('CSRF token is missing in request headers');
      //$input = json_decode(file_get_contents('php://input'), true);
      //$token = $input['csrf_token'] ?? null;
    }

    return $token;
  }

  protected function getCsrfToken() {
    return CsrfService::getToken();
  }
}

?>