import { create } from 'zustand'
import type { UserPresence, Activity } from '@/types'

// Database comment type
export interface CommentData {
  id: string
  workspace_id: string
  entity_type: string
  entity_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  user?: {
    id: string
    email: string
    name: string
    avatar_url?: string
  }
}

// Database activity type with user info
export interface ActivityData {
  id: string
  workspace_id: string
  user_id: string
  action: string
  entity_type: string
  entity_id: string
  metadata?: any
  created_at: string
  user?: {
    id: string
    email: string
    name: string
    avatar_url?: string
  }
}

interface CollaborationStore {
  presence: UserPresence[]
  activities: ActivityData[]
  comments: Record<string, CommentData[]>
  unreadCount: number

  setPresence: (presence: UserPresence[]) => void
  addPresence: (user: UserPresence) => void
  removePresence: (userId: string) => void
  updatePresence: (userId: string, updates: Partial<UserPresence>) => void

  setActivities: (activities: ActivityData[]) => void
  addActivity: (activity: ActivityData) => void

  setComments: (entityId: string, comments: CommentData[]) => void
  addComment: (entityId: string, comment: CommentData) => void
  updateComment: (entityId: string, commentId: string, updates: Partial<CommentData>) => void
  removeComment: (entityId: string, commentId: string) => void

  setUnreadCount: (count: number) => void
  incrementUnreadCount: () => void
}

export const useCollaborationStore = create<CollaborationStore>((set) => ({
  presence: [],
  activities: [],
  comments: {},
  unreadCount: 0,

  setPresence: (presence) => set({ presence }),
  
  addPresence: (user) =>
    set((state) => ({
      presence: [...state.presence.filter((p: any) => p.user_id !== user.user_id), user],
    })),

  removePresence: (userId) =>
    set((state) => ({
      presence: state.presence.filter((p: any) => p.user_id !== userId),
    })),

  updatePresence: (userId, updates) =>
    set((state) => ({
      presence: state.presence.map((p: any) =>
        p.user_id === userId ? { ...p, ...updates } : p
      ),
    })),

  setActivities: (activities) => set({ activities }),
  
  addActivity: (activity) =>
    set((state) => ({
      activities: [activity, ...state.activities].slice(0, 100), // Keep last 100
    })),

  setComments: (entityId, comments) =>
    set((state) => ({
      comments: { ...state.comments, [entityId]: comments },
    })),

  addComment: (entityId, comment) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [entityId]: [...(state.comments[entityId] || []), comment],
      },
    })),

  updateComment: (entityId, commentId, updates) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [entityId]: state.comments[entityId]?.map((c: any) =>
          c.id === commentId ? { ...c, ...updates } : c
        ),
      },
    })),

  removeComment: (entityId, commentId) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [entityId]: state.comments[entityId]?.filter((c: any) => c.id !== commentId),
      },
    })),

  setUnreadCount: (count) => set({ unreadCount: count }),
  incrementUnreadCount: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
}))
