export type Project = {
  id: number;
  title: string;
  description: string;
  userId: number;
  priority: number;
  deletedAt: string;
  isDeleted: boolean;
  status: number;
  tasks: any[];
};


const API_BASE_URL = process.env.API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "API_BASE_URL is missing. Create .env.local at the project root with API_BASE_URL=https://localhost:7001 and restart npm run dev."
  );
}
export async function getProjects() {
  const res = await fetch(`${API_BASE_URL}/projects`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
}

export async function getProjectById(id: number) {
  const res = await fetch(`${API_BASE_URL}/projects/${id}`, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch project ${id}: ${res.status} ${text}`);
  }
  return res.json();
}