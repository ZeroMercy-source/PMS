import DeleteTaskButton from "./DeleteTaskButton"

type Task = {
  Id: number
  ProjectId: number
  Title: string
  Description: string
  IsDeleted: boolean
  Status: string
  Priority: string
}

async function getTasks(projectId: number): Promise<Task[]> {
  const res = await fetch(`http://localhost:3000/api/projects/${projectId}/tasks`, {
    cache: "no-store",
  })

  const text = await res.text().catch(() => "")

  if (!res.ok) {
    console.log("GET TASKS ERROR:", res.status, text)
    return []
  }

  try {
    const data = text ? (JSON.parse(text) as Task[]) : []
    return Array.isArray(data) ? data : []
  } catch {
    console.log("GET TASKS JSON PARSE ERROR:", text)
    return []
  }
}

export default async function TaskList({ projectId }: { projectId: number }) {
  const tasks = await getTasks(projectId)

  const activeTasks = tasks.filter((t) => !t.IsDeleted)

  return (
    <div>
      <h2>Tasks</h2>

      {activeTasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {activeTasks.map((t, idx) => (
            <li key={`${t.ProjectId}-${t.Id}-${idx}`}>
              <span>{t.Title}</span>
              <span> ---- </span>
              <DeleteTaskButton projectId={t.ProjectId} taskId={t.Id} />
              {t.Description ? <div>{t.Description}</div> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
