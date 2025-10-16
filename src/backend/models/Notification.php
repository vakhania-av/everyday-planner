<?php

class Notification {
  private $db;

  public function __construct() {
    $this->db = (new Database())->getConnection();
  }

  public function create($userId, $type, $message, $taskId = null) {
    $statement = $this->db->prepare("INSERT INTO notifications (user_id, type, message, task_id) VALUES (?, ?, ?, ?)");

    return $statement->execute([$userId, $type, $message, $taskId]);
  }

  public function getUserNotifications($userId, $limit = 50) {
    $statement = $this->db->prepare(
      "SELECT n.*, t.title AS task_title
      FROM notifications n
      LEFT JOIN todos t ON n.task_id = t.id
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
      LIMIT ?"
    );

    $statement->execute([$userId, $limit]);

    return $statement->fetchAll();
  }

  public function getUnreadCount($userId) {
    $statement = $this->db->prepare("SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = FALSE");
    $statement->execute([$userId]);

    return $statement->fetch()['count'];
  }

  public function markAsRead($notificationId, $userId) {
    $statement = $this->db->prepare("UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?");

    return $statement->execute([$notificationId, $userId]);
  }

  public function markAllAsRead ($userId) {
    $statement = $this->db->prepare("UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE");

    return $statement->execute([$userId]);
  }

  public function deleteOldNotifications($days = 30) {
    $statement = $this->db->prepare("DELETE FROM notifications WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)");

    return $statement->execute([$days]);
  }
}

?>