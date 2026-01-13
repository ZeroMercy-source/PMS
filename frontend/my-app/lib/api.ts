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


export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${API_BASE_URL}/projects`, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch projects: ${res.status} ${text}`);
  }
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