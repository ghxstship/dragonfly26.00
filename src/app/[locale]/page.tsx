import { redirect } from "next/navigation"

export default function Home() {
  // In a real app, check auth and redirect accordingly
  redirect("/workspace/default/projects")
}
