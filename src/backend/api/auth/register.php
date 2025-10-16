<?php
require_once __DIR__ . '/../../config/cors.php';

// Подключаем Exceptions
require_once __DIR__ . '/../../exceptions/ValidationException.php';
require_once __DIR__ . '/../../exceptions/AuthException.php';
require_once __DIR__ . '/../../exceptions/ServiceException.php';

// Подключаем Services
require_once __DIR__ . '/../../services/ValidationService.php';
require_once __DIR__ . '/../../services/LoggerService.php';

// Подключаем зависимости
require_once __DIR__ . '/../../controllers/BaseController.php';
require_once __DIR__ . '/../../traits/CsrfValidationTrait.php';
require_once __DIR__ . '/../../lib/Auth.php';
require_once __DIR__ . '/../../controllers/RegistrationController.php';

// Создаём экземпляры
$auth = new Auth();
$validator = new ValidationService();
$logger = new LoggerService();

// Создаём и запускаем контроллер
$controller = new RegistrationController($auth, $validator, $logger);

if (session_status() === PHP_SESSION_NONE) {
  session_start();
}

$controller->execute();

?>