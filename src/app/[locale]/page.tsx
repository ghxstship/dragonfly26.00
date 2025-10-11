import { redirect } from "next/navigation"

export default function Home({ params }: { params: { locale: string } }) {
  // In a real app, check auth and redirect accordingly
  redirect(`/${params.locale}/workspace/default/dashboard/overview`)
}
