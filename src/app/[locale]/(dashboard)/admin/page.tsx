import { AdminPageContent } from "@/components/admin/admin-page-content"

// force-dynamic required: AdminPageContent is a client component with state management
// Performance optimization via React Query caching in the component itself
export const dynamic = 'force-dynamic'

export default function AdminPage() {
  return <AdminPageContent />
}
