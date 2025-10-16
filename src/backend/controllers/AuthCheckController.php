<?php
class AuthCheckController extends BaseController {
  /**
   * @var Auth
   */
  private $auth;

  public function __construct($auth, $logger = null) {
    parent::__construct();
    $this->auth = $auth;
  }

  public function handle(): void {
    $authStatus = $this->auth->checkAuth();

    if ($authStatus['authenticated']) {
      // Добавляем свежий CSRF-токен в ответ
      $authStatus['csrf_token'] = CsrfService::getToken();
    }

    $this->respondJson($authStatus);
  }
}

?>