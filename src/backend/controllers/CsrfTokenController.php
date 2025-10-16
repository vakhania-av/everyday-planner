<?php

require_once __DIR__ . '/../services/CsrfService.php';

class CsrfTokenController extends BaseController {
  public function __construct($logger = null) {
    parent::__construct();
  }

  public function getToken() {
    try {
      $token = CsrfService::getToken();

      $this->respondJson([
        'success' => true,
        'token' => $token,
        'timestamp' => time()
      ]);
    } catch (Exception $err) {
      $this->respondJson([
        'success' => false,
        'error' => 'Failed to generate CSRF token'
      ], 500);
    }
  }

  public function refreshToken() {
    try {
      $token = CsrfService::refreshToken();

      $this->respondJson([
        'success' => true,
        'token' => $token,
        'timestamp' => time()
      ]);
    } catch (Exception $err) {
      $this->respondJson([
        'success' => false,
        'error' => 'Failed to refresh CSRF token'
      ], 500);
    }
  }

  protected function handle(): void {
    // Разрешаем только GET
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
      throw new ValidationException('Method not allowed', 405);
    }

    $this->getToken(); // Внутри - getToken(), который сам обновит, если нужно
  }
}

?>