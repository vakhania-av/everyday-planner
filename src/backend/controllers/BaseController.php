<?php

// Подключаем исключения
require_once __DIR__ . '/../exceptions/ValidationException.php';
require_once __DIR__ . '/../exceptions/AuthException.php';
require_once __DIR__ . '/../exceptions/ServiceException.php';
require_once __DIR__ . '/../services/LoggerService.php';

/**
 * Базовый контроллер для всех API-эндпойнтов
 */
abstract class BaseController {
  /**
   * @var Logger
   */
  protected $logger; // LoggerService

  public function __construct($logger = null) {
    $this->logger = $logger ?? new LoggerService();
  }

  protected function handleOptions(): void {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
      exit(0);
    }
  }

  protected function getJsonInput(): array {
    $data = json_decode(file_get_contents('php://input'), true);

    return is_array($data) ? $data : [];
  }

  protected function respondJson(array $data, int $statusCode = 200): void {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');

    echo json_encode($data, JSON_UNESCAPED_UNICODE);
  }

  protected function respondError(string $message, int $statusCode = 400): void {
    $this->respondJson(['error' => $message], $statusCode);
  }

  protected function respondSuccess(string $message, array $extra = [], int $statusCode = 200): void {
    $response = ['message' => $message];

    if (!empty($extra)) {
      $response = array_merge($response, $extra);
    }

    $this->respondJson($response, $statusCode);
  }

  protected function simulateDelay(): void {
    sleep(1); // Защита от timing-атак
  }

  // Главный метод: оборачиваем handle в try-catch
  final public function execute(): void {
    try {
      $this->handleOptions(); // Обработка preflight CORS запросов
      $this->handle();
    } catch (ValidationException $err) {
      $this->logger->info('Validation error', ['message' => $err->getMessage()]);
      $this->respondJson(['error' => $err->getMessage()], $err->getCode());
    } catch (AuthException $err) {
      $this->logger->info('Auth error', ['message' => $err->getMessage()]);
      $this->respondJson(['error' => $err->getMessage()], $err->getCode());
    } catch (ServiceException $err) {
      $this->logger->error('Service error', ['message' => $err->getMessage(), 'trace' => $err->gerTraceAsString()]);
      $this->respondJson(['error' => 'Something went wrong'], 500);
    } catch (Exception $err) {
      $this->logger->error('Unexpected error', ['message' => $err->getMessage(), 'trace' => $err->getTraceAsString()]);
      $this->respondJson(['error' => 'Internal server error'], 500);
    }
  }

  // Абстрактный метод - реализуется в дочерних классах
  abstract protected function handle(): void;
}

?>