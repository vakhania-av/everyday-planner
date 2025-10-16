<?php

class ValidationService {
  public function validateEmail(string $email): void {
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      throw new ValidationException('Invalid email format');
    }
  }

  public function validatePassword(string $password): void {
    if (strlen($password) < 6) {
      throw new ValidationException('Password must be at least 6 characters');
    }
  }

  public function validateName(string $name): void {
    $name = trim($name);

    if (empty($name) || strlen($name) < 2) {
      throw new ValidationException('Name must be at least 2 characters');
    }
  }

  public function validateRequired(array $data, array $fields): void {
    foreach ($fields as $field) {
      if (empty($data[$field])) {
        throw new ValidationException(ucfirst($field) . ' is required');
      }
    }
  }
}

?>