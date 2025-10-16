<?php
require_once __DIR__ . '/../lib/Database.php';
require_once __DIR__ . '/../exceptions/ServiceException.php';

/**
 * Класс, реализующий модель задачи (получение, создание, редактирование, удаление)
 */
class Task {
  private $db;
  private $notificationModel;

  public function __construct($notificationModel) {
    $this->db = (new Database())->getConnection();
    $this->notificationModel = $notificationModel;
  }

  /**
   * Создание новой задачи (служебный)
   */
  private function create($userId, $title, $category = 'other', $deadline = null) {
    $statement = $this->db->prepare("INSERT INTO todos (user_id, title, category, deadline) VALUES (?, ?, ?, ?)");
    $statement->execute([$userId, $title, $category, $deadline]);

    return $this->db->lastInsertId();
  }

  /**
   * Создание новой задачи с уведомлением для пользователя
   */
  public function createWithNotification($userId, $title, $category = 'other', $deadline = null) {
    try {
      // Создаём задачу в отдельной транзакции
      $this->db->beginTransaction();

      $taskId = $this->create($userId, $title, $category, $deadline);

      $this->db->commit();

      // Создаём уведомление в отдельной транзакции
      try {
        $this->db->beginTransaction();

        $message = "New task created: \"{$title}\"";

        $this->notificationModel->create($userId, 'task_created', $message, $taskId);
        $this->db->commit();
      } catch (Exception $err) {
        $this->db->rollBack();
        // Логируем ошибку уведомления, но не прерываем выполнение
        error_log("Notification creation failed: " . $err->getMessage());
      }

      return $taskId;
    } catch (Exception $err) {
      $this->db->rollBack();

      throw new ServiceException("Failed to create a new task with notification: {$err}");
    }
  }

  /**
   * Обновление задачи (служебный)
   */
  private function update($id, $userId, $data) {
    $fields = [];
    $params = [];

    foreach ($data as $key => $value) {
      $fields[] = "$key = ?";
      $params[] = $value;
    }

    $params[] = $id;
    $params[] = $userId;

    $query = "UPDATE todos SET " . implode(', ', $fields) . " WHERE id = ? AND user_id = ?";
    $statement = $this->db->prepare($query);

    return $statement->execute($params);
  }

  /**
   * Обновление задачи с уведомлением для пользователя
   */
  public function updateWithNotification($id, $userId, $data) {
    try {
      // Получаем старые данные задачи
      $oldTask = $this->getById($id, $userId);
      
      // Обновляем задачу в отдельной транзакции
      $this->db->beginTransaction();

      $success = $this->update($id, $userId, $data);

      $this->db->commit();

      if ($success && $oldTask) {
        // Создаём уведомление в отдельной транзакции
        try {
          $this->db->beginTransaction();

          $message = $this->generateUpdateMessage($oldTask, $data);

          if ($message) {
            $this->notificationModel->create($userId, 'task_updated', $message, $id);
          }

          $this->db->commit();
        } catch (Exception $err) {
          $this->db->rollBack();
          // Логируем ошибку уведомления, но не прерываем выполнение
          error_log("Notification creation failed: " . $err->getMessage());
        }
      }

      return $success;
    } catch (Exception $err) {
      $this->db->rollBack();

      throw new ServiceException("Failed to update current task with notification: {$err}");
    }
  }

  /**
   * Удаление задачи (служебный)
   */
  private function delete($id, $userId) {
    $statement = $this->db->prepare("DELETE FROM todos WHERE id = ? AND user_id = ?");

    return $statement->execute([$id, $userId]);
  }

  /**
   * Удаление задачи с уведомлением для пользователя
   */
  public function deleteWithNotification($id, $userId) {
    try {
      // Получаем данные задачи перед удалением
      $task = $this->getById($id, $userId);

      // Удаляем задачу в отдельной транзакции
      $this->db->beginTransaction();

      $success = $this->delete($id, $userId);

      $this->db->commit();

      if ($success && $task) {
        // Создаём уведомление в отдельной транзакции
        try {
          $this->db->beginTransaction();

          $message = "Task deleted: \"{$task['title']}\"";
          
          $this->notificationModel->create($userId, 'task_deleted', $message);
          $this->db->commit();
        } catch (Exception $err) {
          $this->db->rollBack();
          error_log("Notification creation failed: " . $err->getMessage());
        }
      }

      return $success;
    } catch (Exception $err) {
      $this->db->rollBack();

      throw new ServiceException("Failed to delete current task with notification: {$err}");
    }
  }

  /**
   * Получение всех задач текущего пользователя
   */
  public function getAllByUser($userId) {
    $statement = $this->db->prepare("SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC");
    $statement->execute([$userId]);

    return $statement->fetchAll();
  }

  /**
   * Получение задач по идентификатору и id пользователя
   */
  public function getById($id, $userId) {
    $statement = $this->db->prepare("SELECT * FROM todos WHERE id = ? AND user_id = ?");
    $statement->execute([$id, $userId]);

    return $statement->fetch();
  }

  /**
   * Генерация сообщения об изменениях задачи
   */
  private function generateUpdateMessage($oldTask, $newData) {
    $messages = [];

    // Проверяем изменение статуса выполнения
    if (isset($newData['completed']) && $newData['completed'] != $oldTask['completed']) {
      $messages[] = ($newData['completed']) ? "Task completed: \"{$oldTask['title']}\"" : "Task marked as incomplete: \"{$oldTask['title']}\"";
    }

    // Проверяем изменение названия
    if (isset($newData['title']) && $newData['title'] != $oldTask['title']) {
      $messages[] = "Task renamed: \"{$oldtask['title']}\" → \"{$newData['title']}\"";
    }

    // Проверяем изменение дедлайна
    if (isset($newData['deadline']) && $newData['deadline'] != $oldTask['deadline']) {
      $oldDeadline = $oldTask['deadline'] ? date('M j, Y', strtotime($oldTask['deadline'])) : 'No deadline';
      $newDeadline = $newData['deadline'] ? date('M j, Y', strtotime($newData['deadline'])) : 'No deadline';
      $messages[] = "Deadline changed for \"{$oldTask['title']}\": {$oldDeadline} → {$newDeadline}";
    }

    return implode('; ', $messages);
  }
}
?>