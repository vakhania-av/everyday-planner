<?php

class NotificationController extends BaseController {
  use CsrfValidationTrait;

  private $auth;
  private $notificationModel;

  public function __construct($auth, $notificationModel, $logger = null) {
    parent::__construct();
    $this->auth = $auth;
    $this->notificationModel = $notificationModel;
  }

  public function getUserNotifications() {
    // Проверка аутентификации
    $this->checkAuth();

    $userId = $_SESSION['user_id'];

    try {
      $notifications = $this->notificationModel->getUserNotifications($userId);
      $unreadCount = $this->notificationModel->getUnreadCount($userId);

      $this->respondJson([
        'success' => true,
        'notifications' => $notifications,
        'unreadCount' => $unreadCount
      ]);
    } catch (Exception $err) {
      throw new ServiceException('Failed to fetch notifications', 500);
    }
  }

  public function markAsRead() {
    // Проверка аутентификации
    $this->checkAuth();
    
    $userId = $_SESSION['user_id'];
    $data = $this->getJsonInput();
    $notificationId = $data['id'] ?? null;

    if (!$notificationId) {
      throw new ServiceException('Notification ID is required', 400);
    }

    $success = $this->notificationModel->markAsRead($notificationId, $userId);

    if ($success) {
      $this->respondJson(['success' => true]);
    } else {
      throw new ServiceException('Failed to mark notification as read', 500);
    }
  }

  public function markAllAsRead() {
    // Проверка аутентификации
    $this->checkAuth();

    $userId = $_SESSION['user_id'];
    $success = $this->notificationModel->markAllAsRead($userId);

    $this->respondJson(['success' => $success]);
  }

  public function handle(): void {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
      $this->getUserNotifications();
    } else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      $data = $this->getJsonInput();

      if (isset($data['option'])) {
        if ($data['option'] === 'mark-read') {
          $this->markAsRead();
        } else if ($data['option'] === 'mark-all-read') {
          $this->markAllAsRead();
        } else {
          throw new ValidationException('Method not allowed', 405);
        }
      }
    } else {
      throw new ValidationException('Method not allowed', 405);
    }
  }

  private function checkAuth() {
    $authStatus = $this->auth->checkAuth();

    if (!$authStatus['authenticated']) {
      throw new ValidationException('Unathorized', 401);
    }
  }
}

?>