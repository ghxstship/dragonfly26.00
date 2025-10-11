import { create } from 'zustand'
import type { Organization, Workspace, OrganizationMember } from '@/types'

interface WorkspaceStore {
  organizations: Organization[]
  currentOrganization: Organization | null
  workspaces: Workspace[]
  members: OrganizationMember[]
  isLoading: boolean

  setOrganizations: (orgs: Organization[]) => void
  setCurrentOrganization: (org: Organization | null) => void
  setWorkspaces: (workspaces: Workspace[]) => void
  setMembers: (members: OrganizationMember[]) => void
  setIsLoading: (loading: boolean) => void
  addWorkspace: (workspace: Workspace) => void
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void
  removeWorkspace: (id: string) => void
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  organizations: [],
  currentOrganization: null,
  workspaces: [],
  members: [],
  isLoading: false,

  setOrganizations: (orgs) => set({ organizations: orgs }),
  setCurrentOrganization: (org) => set({ currentOrganization: org }),
  setWorkspaces: (workspaces) => set({ workspaces }),
  setMembers: (members) => set({ members }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  addWorkspace: (workspace) =>
    set((state) => ({
      workspaces: [...state.workspaces, workspace],
    })),

  updateWorkspace: (id, updates) =>
    set((state) => ({
      workspaces: state.workspaces.map((ws) =>
        ws.id === id ? { ...ws, ...updates } : ws
      ),
    })),

  removeWorkspace: (id) =>
    set((state) => ({
      workspaces: state.workspaces.filter((ws) => ws.id !== id),
    })),
}))
