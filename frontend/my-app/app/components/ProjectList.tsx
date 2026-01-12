import Link from "next/link";
import { getProjects } from "../../lib/api";

export default async function ProjectList() {
  const projects = await getProjects();

  return (
    <div>
      <h1>Projects</h1>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <ul>
          {projects.map((p) => (
            <li key={p.id}>
              <Link href={`/projects/${p.id}`}>{p.title}</Link>
              {p.description ? <div>{p.description}</div> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}