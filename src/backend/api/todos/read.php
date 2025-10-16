<?php

require_once __DIR__ . '/../../config/cors.php';

// Подключаем базовые компоненты и зависимости
require_once __DIR__ . '/../../controllers/BaseController.php';
require_once __DIR__ . '/../../traits/CsrfValidationTrait.php';
require_once __DIR__ . '/../../models/Task.php';
require_once __DIR__ . '/../../models/Notification.php';
require_once __DIR__ . '/../../lib/Auth.php';
require_once __DIR__ . '/../../controllers/TaskController.php';

// Создаём экземпляры
$auth = new Auth();
$notificationModel = new Notification();
$taskModel = new Task($notificationModel);
$action = 'read';

// Создаём контроллер и обрабатываем запрос
$controller = new TaskController($auth, $taskModel, $action);

if (session_status() === PHP_SESSION_NONE) {
  session_start();
}

$controller->execute();

?>