import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UIState, ThemeMode, Density, Workspace, Module, View, ModuleTab } from '@/types'

interface TabConfig {
  [moduleId: string]: ModuleTab[]
}

interface UIStore extends UIState {
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  setRightSidebarOpen: (open: boolean, tab?: string) => void
  toggleRightSidebar: (tab?: string) => void
  rightSidebarTab: string
  setRightSidebarTab: (tab: string) => void
  setDensity: (density: Density) => void
  setTheme: (theme: ThemeMode) => void
  setAccentColor: (color: string) => void
  setCurrentWorkspace: (workspace: Workspace | undefined) => void
  setCurrentModule: (module: Module | undefined) => void
  setCurrentView: (view: View | undefined) => void
  focusMode: boolean
  toggleFocusMode: () => void
  setFocusMode: (enabled: boolean) => void
  airplaneMode: boolean
  toggleAirplaneMode: () => void
  setAirplaneMode: (enabled: boolean) => void
  tabConfigs: TabConfig
  setTabConfig: (moduleId: string, tabs: ModuleTab[]) => void
  getTabConfig: (moduleId: string) => ModuleTab[] | undefined
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: true,
      rightSidebarOpen: true,
      rightSidebarTab: 'activity',
      density: 'comfortable',
      theme: 'light',
      accentColor: '#7c3aed',
      currentWorkspace: undefined,
      currentModule: undefined,
      currentView: undefined,
      focusMode: false,
      airplaneMode: false,
      tabConfigs: {}, // Tab configs cache - cleared on 2024-10-11 for dashboard update

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setRightSidebarOpen: (open, tab) => set({ 
        rightSidebarOpen: open,
        ...(tab && { rightSidebarTab: tab })
      }),
      toggleRightSidebar: (tab) => set((state) => ({ 
        rightSidebarOpen: !state.rightSidebarOpen,
        ...(tab && { rightSidebarTab: tab })
      })),
      setRightSidebarTab: (tab) => set({ rightSidebarTab: tab }),
      setDensity: (density) => set({ density }),
      setTheme: (theme) => set({ theme }),
      setAccentColor: (color) => set({ accentColor: color }),
      setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
      setCurrentModule: (module) => set({ currentModule: module }),
      setCurrentView: (view) => set({ currentView: view }),
      toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
      setFocusMode: (enabled) => set({ focusMode: enabled }),
      toggleAirplaneMode: () => set((state) => ({ airplaneMode: !state.airplaneMode })),
      setAirplaneMode: (enabled) => set({ airplaneMode: enabled }),
      setTabConfig: (moduleId, tabs) => set((state) => ({
        tabConfigs: { ...state.tabConfigs, [moduleId]: tabs }
      })),
      getTabConfig: (moduleId) => {
        return get().tabConfigs[moduleId]
      },
    }),
    {
      name: 'ui-storage-v2', // Changed from 'ui-storage' to invalidate old cached tabs
    }
  )
)
