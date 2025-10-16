<?php

class ValidationException extends Exception {
  public function __construct(string $message = "Validation failed", int $code = 400) {
    parent::__construct($message, $code);
  }
}

?>