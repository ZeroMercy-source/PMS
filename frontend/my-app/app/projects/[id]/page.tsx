import CreateTask from "./CreateTask";
import TaskList from "./TaskList";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projectId = Number(id);

  if (!Number.isFinite(projectId)) return <div>Invalid project id.</div>;

  return (
    <main>
      <CreateTask projectId={projectId} />
      <TaskList projectId={projectId} />
    </main>
  );
}
