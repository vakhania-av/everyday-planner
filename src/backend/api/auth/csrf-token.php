<?php

require_once __DIR__ . '/../../config/cors.php';

// Подключаем базовые компоненты и зависимости
require_once __DIR__ . '/../../controllers/BaseController.php';
require_once __DIR__ . '/../../controllers/CsrfTokenController.php';

// Создаём и запускаем контроллер
$controller = new CsrfTokenController($logger);

if (session_status() === PHP_SESSION_NONE) {
  session_start();
}

$controller->execute();

?>