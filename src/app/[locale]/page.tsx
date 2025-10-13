import { redirect } from "next/navigation"

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  // In a real app, check auth and redirect accordingly
  redirect(`/${locale}/workspace/personal/dashboard/overview`)
}
