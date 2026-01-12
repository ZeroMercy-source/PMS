import { getProjectById } from "../../../lib/api";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;          
  const projectId = Number(id);

  if (!Number.isFinite(projectId)) {
    return <div>Invalid project id.</div>;
  }

  const project = await getProjectById(projectId);

  return (
    <main>
      <h1>Project Details</h1>
      <h1>{project.title}</h1>
      {project.description ? <p>{project.description}</p> : null}
    </main>
  );
}