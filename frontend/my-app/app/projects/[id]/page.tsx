import Link from "next/link";

type Project = {
  id: number;
  title: string;
  description: string;
};

export default async function ProjectDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const res = await fetch(`${baseUrl}/projects/${params.id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div style={{ padding: 24 }}>
        <Link href="/">← Back</Link>
        <h1>Project Details</h1>
        <p>Failed to load project. Status: {res.status}</p>
      </div>
    );
  }

  const project: Project = await res.json();

  return (
    <div style={{ padding: 24 }}>
      <Link href="/">← Back</Link>
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      <p>ID: {project.id}</p>
    </div>
  );
}


