import { createClient } from '@/lib/supabase/client'

export interface CreateNotificationParams {
  userId: string
  type: 'mention' | 'comment' | 'assignment' | 'update' | 'system'
  title: string
  message: string
  link?: string | null
}

/**
 * Service for managing notifications
 */
export class NotificationService {
  private supabase = createClient()

  /**
   * Create a new notification for a user
   */
  async createNotification(params: CreateNotificationParams) {
    const { data, error } = await this.supabase
      .from('notifications')
      .insert({
        user_id: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        link: params.link || null,
        read: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating notification:', error)
      throw error
    }

    return data
  }

  /**
   * Create multiple notifications at once
   */
  async createBulkNotifications(notifications: CreateNotificationParams[]) {
    const { data, error } = await this.supabase
      .from('notifications')
      .insert(
        notifications.map(n => ({
          user_id: n.userId,
          type: n.type,
          title: n.title,
          message: n.message,
          link: n.link || null,
          read: false,
        }))
      )
      .select()

    if (error) {
      console.error('Error creating bulk notifications:', error)
      throw error
    }

    return data
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string) {
    const { error } = await this.supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)

    if (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    const { error } = await this.supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) {
      console.error('Error marking all notifications as read:', error)
      throw error
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string) {
    const { error } = await this.supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)

    if (error) {
      console.error('Error deleting notification:', error)
      throw error
    }
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) {
      console.error('Error getting unread count:', error)
      throw error
    }

    return count || 0
  }

  /**
   * Create test notifications for development
   */
  async createTestNotifications(userId: string) {
    const testNotifications: CreateNotificationParams[] = [
      {
        userId,
        type: 'mention',
        title: 'You were mentioned in a task',
        message: 'Sarah mentioned you in "Review Q4 Budget Proposal"',
        link: '/workspace/tasks/test-123',
      },
      {
        userId,
        type: 'comment',
        title: 'New comment on your task',
        message: 'John commented: "I have reviewed the document and it looks good"',
        link: '/workspace/tasks/test-456',
      },
      {
        userId,
        type: 'assignment',
        title: 'You were assigned to a project',
        message: 'You have been assigned to "Marketing Campaign 2024"',
        link: '/workspace/projects/test-789',
      },
    ]

    return this.createBulkNotifications(testNotifications)
  }
}

// Export singleton instance
export const notificationService = new NotificationService()
