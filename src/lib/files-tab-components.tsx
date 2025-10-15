// Files module tab components registry
// For now, return undefined to use default view system

interface FilesTabProps {
  data?: any[]
  loading?: boolean
}

export const FILES_TAB_COMPONENTS: Record<string, React.ComponentType<FilesTabProps> | undefined> = {
  // Add custom files tab components here when needed
  // 'all-documents': AllDocumentsTab,
  // 'contracts': ContractsTab,
  // 'riders': RidersTab,
  // 'tech-specs': TechSpecsTab,
  // 'call-sheets': CallSheetsTab,
  // 'insurance-permits': InsurancePermitsTab,
  // 'media-assets': MediaAssetsTab,
  // 'production-reports': ProductionReportsTab,
  // 'shared': SharedTab,
  // 'archive': ArchiveTab,
}

export function getFilesTabComponent(tabSlug: string): React.ComponentType<FilesTabProps> | undefined {
  return FILES_TAB_COMPONENTS[tabSlug]
}
