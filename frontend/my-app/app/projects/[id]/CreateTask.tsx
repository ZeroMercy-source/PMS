"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTask({ projectId }: { projectId: number }) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create() {
    setError(null);

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    setLoading(true);

    try {
      const body: any = { title: title.trim() };

     
      if (description.trim()) {
        body.description = description.trim();
      }

      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `HTTP ${res.status}`);
      }

      setTitle("");
      setDescription("");
      router.refresh();
    } catch (e: any) {
      setError(e.message ?? "Failed to create task");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Create Task</h2>

      <div>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button onClick={create} disabled={loading}>
        {loading ? "Creating..." : "Create"}
      </button>

      {error ? <p>{error}</p> : null}
    </div>
  );
}
