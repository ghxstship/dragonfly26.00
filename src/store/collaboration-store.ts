import { create } from 'zustand'
import type { UserPresence, Activity, Comment } from '@/types'

interface CollaborationStore {
  presence: UserPresence[]
  activities: Activity[]
  comments: Record<string, Comment[]>
  unreadCount: number

  setPresence: (presence: UserPresence[]) => void
  addPresence: (user: UserPresence) => void
  removePresence: (userId: string) => void
  updatePresence: (userId: string, updates: Partial<UserPresence>) => void

  setActivities: (activities: Activity[]) => void
  addActivity: (activity: Activity) => void

  setComments: (entityId: string, comments: Comment[]) => void
  addComment: (entityId: string, comment: Comment) => void
  updateComment: (entityId: string, commentId: string, updates: Partial<Comment>) => void
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
      presence: [...state.presence.filter((p) => p.user_id !== user.user_id), user],
    })),

  removePresence: (userId) =>
    set((state) => ({
      presence: state.presence.filter((p) => p.user_id !== userId),
    })),

  updatePresence: (userId, updates) =>
    set((state) => ({
      presence: state.presence.map((p) =>
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
        [entityId]: state.comments[entityId]?.map((c) =>
          c.id === commentId ? { ...c, ...updates } : c
        ),
      },
    })),

  removeComment: (entityId, commentId) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [entityId]: state.comments[entityId]?.filter((c) => c.id !== commentId),
      },
    })),

  setUnreadCount: (count) => set({ unreadCount: count }),
  incrementUnreadCount: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
}))
