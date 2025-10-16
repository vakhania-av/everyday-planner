<?php
require_once __DIR__ . '/../../config/cors.php';

// Подключаем базовые компоненты
require_once __DIR__ . '/../../controllers/BaseController.php';
require_once __DIR__ . '/../../traits/CsrfValidationTrait.php';
require_once __DIR__ . '/../../services/CsrfService.php';

// Подключаем зависимости
require_once __DIR__ . '/../../models/User.php';
require_once __DIR__ . '/../../models/PasswordReset.php';
require_once __DIR__ . '/../../lib/Mailer.php';
require_once __DIR__ . '/../../controllers/ForgotPasswordController.php';

// Создаём экземпляры
$userModel = new User();
$passwordResetModel = new PasswordReset();
$mailer = new Mailer();

// Создаём контроллер и обрабатываем запрос
$controller = new ForgotPasswordController($userModel, $passwordResetModel, $mailer);

if (session_status() === PHP_SESSION_NONE) {
  session_start();
}

$controller->execute();

?>