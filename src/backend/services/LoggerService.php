<?php

class LoggerService {
  /**
   * @var LogFile
   */
  private $logFile;

  public function __construct(string $logFile = null) {
    if ($logFile === null) {
      $logFile = __DIR__ . '/../../logs/app.log';
    }
    
    $this->logFile = $logFile;

    // Создаём папку, если не существует
    $logDir = dirname($logFile);

    if (!is_dir($logDir)) {
      mkdir($logDir, 0755, true);
    }
  }

  public function error(string $message, array $context = []): void {
    $this->log('ERROR', $message, $context);
  }

  public function info(string $message, array $context = []): void {
    $this->log('INFO', $message, $context);
  }

  private function log(string $level, string $message, array $context = []): void {
    $timestamp = date('Y-m-d H:i:s');
    $contextStr = !empty($context) ? ' ' . json_encode($context, JSON_UNESCAPED_UNICODE) : '';
    $line = "[{$timestamp}] {$level}: {$message}{$contextStr}" . PHP_EOL;

    file_put_contents($this->logFile, $line, FILE_APPEND | LOCK_EX);
  }
}

?>