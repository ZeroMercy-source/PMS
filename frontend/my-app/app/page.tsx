import Link from "next/link";

type Project = {
  id: number;
  title: string;
  description: string;
};

export default async function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const res = await fetch(`${baseUrl}/projects`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Projects</h1>
        <p>Failed to load projects. Status: {res.status}</p>
      </div>
    );
  }

  const projects: Project[] = await res.json();

  return (
    <div style={{ padding: 24 }}>
      <h1>Projects</h1>

      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <Link href={`/projects/${p.id}`}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}