export enum Status {
  ToDO = 0,
  InProgress = 1,
  Done = 2,
  Deleted = 3,
}

export enum Priority {
  Low = 0,
  Medium = 1,
  High = 2,
  Urgent = 3,
}

export const StatusLabels = {
  [Status.ToDO]: "To Do",
  [Status.InProgress]: "In Progress",
  [Status.Done]: "Done",
  [Status.Deleted]: "Deleted",
};

export const PriorityLabels = {
  [Priority.Low]: "Low",
  [Priority.Medium]: "Medium",
  [Priority.High]: "High",
  [Priority.Urgent]: "Urgent",
};

export interface SubTask {
  id: number;
  title: string;
  description: string;
  status: Status;
  isDeleted: boolean;
  deletedAt: string;
  aTaskId: number;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  isDeleted: boolean;
  deletedAt: string;
  projectId: number;
  subTasks: SubTask[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  isDeleted: boolean;
  deletedAt: string;
  userId: number;
  tasks: Task[];
}
