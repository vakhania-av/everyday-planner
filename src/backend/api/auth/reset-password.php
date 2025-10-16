<?php
require_once __DIR__ . '/../../config/cors.php';

// Подключаем базовые компоненты
require_once __DIR__ . '/../../controllers/BaseController.php';

// Подключаем зависимости
require_once __DIR__ . '/../../models/User.php';
require_once __DIR__ . '/../../models/PasswordReset.php';
require_once __DIR__ . '/../../controllers/PasswordResetController.php';

// Создаём экземпляры
$userModel = new User();
$passwordResetModel = new PasswordReset();

// Создаём контроллер и обрабатываем запрос
$controller = new PasswordResetController($userModel, $passwordResetModel);

$controller->execute();

?>