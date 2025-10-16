<?php
// Конфигурация для класса Mailer
class MailConfig {
  public static $smtpHost = 'smtp.gmail.com';
  public static $smtpPort = 587;
  public static $smtpUser;
  public static $smtpPass;

  public function __construct($user, $password) {
    self::$smtpUser = $user;
    self::$smtpPass = $password;
  }
}
?>