<?php

require_once __DIR__ . '/../../config/cors.php';

// Подключаем базовые компоненты
require_once __DIR__ . '/../../controllers/BaseController.php';
require_once __DIR__ . '/../../traits/CsrfValidationTrait.php';

// Подключаем зависимости
require_once __DIR__ . '/../../lib/Auth.php';
require_once __DIR__ . '/../../models/User.php';
require_once __DIR__ . '/../../controllers/EditProfileController.php';

// Создаём экземпляры
$auth = new Auth();
$userModel = new User();

if (session_status() === PHP_SESSION_NONE) {
  session_start();
}

// Создаём контроллер и обрабатываем запрос
$controller = new EditProfileController($auth, $userModel);

$controller->execute();

?>