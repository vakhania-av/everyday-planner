<?php
require_once __DIR__ . '/../../config/cors.php';

// Подключаем базовые компоненты
require_once __DIR__ . '/../../controllers/BaseController.php';
require_once __DIR__ . '/../../services/CsrfService.php';
require_once __DIR__ . '/../../services/LoggerService.php';

// Подключаем зависимости
require_once __DIR__ . '/../../lib/Auth.php';
require_once __DIR__ . '/../../controllers/AuthCheckController.php';

// Создаём экземпляры
$auth = new Auth();
$logger = new LoggerService();

// Создаём контроллер и обрабатываем запрос
$controller = new AuthCheckController($auth);

if (session_status() === PHP_SESSION_NONE) {
  session_start();
}

$controller->execute();

?>