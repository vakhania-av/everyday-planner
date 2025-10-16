<?php
// Точка входа
require_once __DIR__ . '/../config/session.php';
require_once __DIR__ . '/../lib/Database.php';

$url = $_GET['url'] ?? '';
$parts = explode('/', $url);

$endpoint = $parts[0] ?? '';
$action = $parts[1] ?? '';

switch ($endpoint) {
  case 'auth':
    require __DIR__ . "/../api/auth/$action.php";
    break;
  case 'todos':
    require __DIR__ . "/../api/todos/$action.php";
    break;
  default:
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found']);
    break;
}
?>