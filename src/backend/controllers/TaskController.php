<?php

class TaskController extends BaseController {
  use CsrfValidationTrait;

  private $auth;
  private $taskModel;
  private $action;

  public function __construct($auth, $taskModel, $action, $logger = null) {
    parent::__construct();
    $this->auth = $auth;
    $this->taskModel = $taskModel;
    $this->action = $action;
  }

  public function handle(): void {
    // Проверка аутентификации
    $this->auth->checkAuth();
    // Получаем ID пользователя сессии
    $userId = $_SESSION['user_id'];
    $data = $this->getJsonInput();

    switch ($this->action) {
      case 'create':
        $this->createTask($userId, $data);
        break;
      case 'read':
        $this->getTasks($userId);
        break;
      case 'update':
        $this->updateTask($userId, $data);
        break;
      case 'delete':
        $this->deleteTask($userId);
        break;
    }
  }

  /**
   * Получение списка всех задач
   */
  private function getTasks($userId) {
    $tasks = $this->taskModel->getAllByUser($userId);

    $this->respondJson([
      'success' => true,
      'tasks' => $tasks,
      'message' => 'All the tasks have been received successfully'
    ]);
  }

  /**
   * Создание новой задачи
   */
  private function createTask($userId, $data) {
    // Валидация поля с наименованием задачи
    if (empty($data['title'])) {
      throw new ValidationException('Title is required');
    }

    $taskId = $this->taskModel->createWithNotification(
      $userId, 
      $data['title'], 
      $data['category'] ?? 'other', 
      $data['deadline'] ?? null
    );

    $this->respondJson([
      'success' => true,
      'id' => $taskId,
      'message' => 'Task created successfully'
    ]);
  }

  /**
   * Обновление текущей задачи пользователя
   */
  private function updateTask($userId, $data) {
    if (!in_array($_SERVER['REQUEST_METHOD'], ['PUT', 'POST', 'PATCH'])) {
      throw new ValidationException('Method not allowed', 405);
    }

    $taskId = $_GET['id'] ?? null;

    if (!$taskId || !is_numeric($taskId)) {
      throw new ValidationException("You don't have permission to update this task", 400);
    }

    // Подготовка данных для обновления
    $updateData = [];

    if (isset($data['title'])) {
      $updateData['title'] = htmlspecialchars($data['title']);
    }

    if (isset($data['completed'])) {
      $updateData['completed'] = boolval($data['completed']);
    }

    if (isset($data['category'])) {
      $validCategories = ['work', 'personal', 'shopping', 'other'];
      $updateData['category'] = in_array($data['category'], $validCategories) ? $data['category'] : 'other';
    }

    if (isset($data['deadline'])) {
      $updateData['deadline'] = $data['deadline'] ? date('Y-m-d H:i:s', strtotime($data['deadline'])) : null;
    }

    if (empty($updateData)) {
      throw new ServiceException('No data provided for update', 400);
    }

    $success = $this->taskModel->updateWithNotification($taskId, $userId, $updateData);

    if ($success) {
      $updatedTask = $this->taskModel->getById($taskId, $userId);

      $this->respondJson([
        'success' => true,
        'task' => $updatedTask,
        'message' => 'Task updated successfully'
      ]);
    } else {
      throw new ServiceException('Task not found', 404);
    }
  }

  private function deleteTask($userId) {
    if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
      throw new ValidationException('Method not allowed. Use DELETE', 405);
    }

    $taskId = $_GET['id'] ?? null;

    if (!$taskId || !is_numeric($taskId)) {
      throw new ValidationException("You don't have permission to delete this task", 400);
    }

    // Удаление задачи
    $success = $this->taskModel->deleteWithNotification($taskId, $userId);

    if ($success) {
      $this->respondSuccess('Task deleted successfully!');
    } else {
      throw new ServiceException('Task not found', 404);
    }
  }
}

?>