<?php
// Класс, реализующий отправку email
class Mailer {
  public function sendPasswordReset($email, $token) {
    $resetLink = "http://localhost:5173/reset-password?token=" . urlencode($token);
    $subject = "
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password. Click the link below to proceed:</p>
      <p>
        <a href='{$resetLink}' style='background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px';'>
          Reset Password
        </a>
      </p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>";

    return $this->sendEmail($email, $subject, $message);
  }

  private function sendEmail($to, $subject, $body) {
    // Для разработки - просто логируем
    error_log("Email to: {$to}");
    error_log("Subject: {$subject}");
    error_log("Body: {$body}");

    return [
      'message' => 'If the email exists, reset instructions have been sent',
      'data' => "Email to: {$to}<br>Subject: {$subject}<br>Body: {$body}"
    ];
  }
}
?>