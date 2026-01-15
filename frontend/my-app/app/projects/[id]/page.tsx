
import CreateTask from "./CreateTask"
import TaskList from "./TaskList"

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const projectId = Number(id)

  if (!Number.isFinite(projectId)) {
    return (
      <main className="min-h-screen bg-muted/40">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h1 className="text-3xl font-semibold tracking-tight">Project</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Invalid project id.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-muted/40">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Project Details</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create tasks and manage them for this project.
            </p>
          </div>

          <CreateTask projectId={projectId} />
        </div>

        <div className="mt-8">
          <TaskList projectId={projectId} />
        </div>
      </div>
    </main>
  )
}
