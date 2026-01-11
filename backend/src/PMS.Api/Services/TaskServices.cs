using Microsoft.EntityFrameworkCore;
using PMS.Api.Data;
using PMS.Api.Domain;
using PMS.Api.Models;

namespace PMS.Api.Services
{
    public class TaskServices
    {
        private readonly PmsDbContext _context;

        public TaskServices(PmsDbContext context)
        {
            _context = context;
        }

        public List<ATask> GetTasks(int projectId, string? search, string? filter, MyEnum.Priority? priority, MyEnum.Status? status)
        {
            IQueryable<ATask> tasks = _context.Tasks
                .Include(t => t.SubTasks)
                .Where(t => t.ProjectId == projectId && !t.IsDeleted);

            if (!string.IsNullOrWhiteSpace(search))
            {
                string lowerSearch = search.ToLower();
                tasks = tasks.Where(t =>
                    (t.Title ?? "").ToLower().Contains(lowerSearch) ||
                    (t.Description ?? "").ToLower().Contains(lowerSearch) ||
                    (t.SubTasks != null && t.SubTasks.Any(st =>
                        (st.Title ?? "").ToLower().Contains(lowerSearch) ||
                        (st.Description ?? "").ToLower().Contains(lowerSearch)
                    ))
                );
            }

            if (priority.HasValue)
            {
                tasks = tasks.Where(t => t.Priority == priority.Value);
            }

            if (status.HasValue)
            {
                tasks = tasks.Where(t => t.Status == status.Value);
            }

            if (!string.IsNullOrWhiteSpace(filter))
            {
                string s = filter.Trim().ToLowerInvariant();

                if (s == "title") tasks = tasks.OrderBy(t => t.Title);
                else if (s == "title_desc") tasks = tasks.OrderByDescending(t => t.Title);
                else if (s == "priority") tasks = tasks.OrderBy(t => t.Priority);
                else if (s == "priority_desc") tasks = tasks.OrderByDescending(t => t.Priority);
                else if (s == "status") tasks = tasks.OrderBy(t => t.Status);
                else if (s == "status_desc") tasks = tasks.OrderByDescending(t => t.Status);
            }

            return tasks.ToList();
        }

        public ATask? GetTaskById(int projectId, int id)
        {
            return _context.Tasks
                .Include(t => t.SubTasks)
                .FirstOrDefault(t => t.Id == id && t.ProjectId == projectId && !t.IsDeleted);
        }

        public ATask? CreateTask(int projectId, string title, string description)
        {
            var project = _context.Projects.FirstOrDefault(p => p.Id == projectId && !p.IsDeleted);
            if (project == null)
            {
                return null;
            }

            var task = new ATask
            {
                Title = title,
                Description = description,
                Status = MyEnum.Status.InProgress,
                Priority = MyEnum.Priority.Low,
                ProjectId = projectId,
                IsDeleted = false,
                DeletedAt = DateTime.MinValue
            };

            _context.Tasks.Add(task);
            _context.SaveChanges();

            return task;
        }

        public List<ATask> GetDeletedTasks(int projectId)
        {
            return _context.Tasks
                .Where(t => t.ProjectId == projectId && t.IsDeleted)
                .ToList();
        }

        public bool DeleteTask(int projectId, int id)
        {
            var taskToDelete = _context.Tasks.FirstOrDefault(t => t.Id == id && t.ProjectId == projectId && !t.IsDeleted);
            if (taskToDelete == null)
            {
                return false;
            }

            taskToDelete.IsDeleted = true;
            taskToDelete.DeletedAt = DateTime.UtcNow;
            _context.SaveChanges();

            return true;
        }

        public bool RestoreTask(int projectId, int id)
        {
            var task = _context.Tasks.FirstOrDefault(t => t.Id == id && t.ProjectId == projectId && t.IsDeleted);
            if (task == null)
            {
                return false;
            }

            task.IsDeleted = false;
            _context.SaveChanges();

            return true;
        }

        public bool EditTask(int projectId, int id,
            string? title,
            string? description,
            MyEnum.Status? status,
            MyEnum.Priority? priority)
        {
            ATask? task = _context.Tasks.FirstOrDefault(t => t.Id == id && t.ProjectId == projectId && !t.IsDeleted);

            bool flag = false;

            if (task == null)
            {
                return false;
            }

            if (!string.IsNullOrWhiteSpace(title))
            {
                TaskDomain.EditTaskTitle(task, title);
                flag = true;
            }
            if (!string.IsNullOrWhiteSpace(description))
            {
                TaskDomain.EditTaskDescription(task, description);
                flag = true;
            }
            if (status.HasValue)
            {
                TaskDomain.ChangeTaskStatus(task, status.Value);
                flag = true;
            }
            if (priority.HasValue)
            {
                TaskDomain.ChangeTaskPriority(task, priority.Value);
                flag = true;
            }

            if (flag)
            {
                _context.SaveChanges();
            }

            return flag;
        }

        public void PermDeleteTask(int projectId)
        {
            var tasksToDelete = _context.Tasks
                .Where(t => t.ProjectId == projectId && t.IsDeleted && (DateTime.UtcNow - t.DeletedAt).TotalHours > 72)
                .ToList();

            _context.Tasks.RemoveRange(tasksToDelete);
            _context.SaveChanges();
        }
    }
}
