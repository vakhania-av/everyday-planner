<?php
require_once __DIR__ . '/../../config/cors.php';

// Подключаем базовые компоненты
require_once __DIR__ . '/../../controllers/BaseController.php';
require_once __DIR__ . '/../../traits/CsrfValidationTrait.php';

// Подключаем зависимости
require_once __DIR__ . '/../../lib/Auth.php';
require_once __DIR__ . '/../../controllers/LoginController.php';

// Создаём экземпляры
$auth = new Auth();

// Создаём контроллер и обрабатываем запрос
$controller = new LoginController($auth);

if (session_status() === PHP_SESSION_NONE) {
  session_start();
}

$controller->execute();

?>