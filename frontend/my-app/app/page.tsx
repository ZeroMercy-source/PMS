import Navbar from "./components/Navbar"
import CreateProject from "./components/CreateProject"
import ProjectList from "./components/ProjectList"

export default function Home() {
  return (
    <main className="min-h-screen bg-muted/40">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create projects and manage tasks in one place.
            </p>
          </div>

          <CreateProject />
        </div>

        <div className="mt-8">
          <ProjectList />
        </div>
      </div>
    </main>
  )
}
