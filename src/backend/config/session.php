<?php
// Настройка куки сессии
ini_set('session.cookie_lifetime', 86400); // 1 день
ini_set('session.gc_maxlifetime', 86400);
ini_set('session.cookie_secure', false); // true для HTTPS
ini_set('session.cookie_httponly', true);
ini_set('session.cookie_samesite', 'None');

// Старт сессии с настройками
session_set_cookie_params([
  'lifetime' => 86400,
  'path' => '/',
  'domain' => 'localhost/my-todo-app',
  'secure' => false,
  'httponly' => true,
  'samesite' => 'None'
]);

session_start();

?>