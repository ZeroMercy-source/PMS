using Microsoft.EntityFrameworkCore;
using PMS.Api.Data;
using PMS.Api.Domain;
using PMS.Api.Models;

namespace PMS.Api.Services
{
    public class SubTaskServices
    {
        private readonly PmsDbContext _context;

        public SubTaskServices(PmsDbContext context)
        {
            _context = context;
        }

        public List<SubTask> GetSubTasks(int taskId, string? search, string? filter, MyEnum.Status? status)
        {
            IQueryable<SubTask> subTasks = _context.SubTasks
                .Where(st => st.ATaskId == taskId && !st.IsDeleted);

            if (!string.IsNullOrWhiteSpace(search))
            {
                string lowerSearch = search.ToLower();
                subTasks = subTasks.Where(st =>
                    (st.Title ?? "").ToLower().Contains(lowerSearch) ||
                    (st.Description ?? "").ToLower().Contains(lowerSearch)
                );
            }

            if (status.HasValue)
            {
                subTasks = subTasks.Where(st => st.Status == status.Value);
            }

            if (!string.IsNullOrWhiteSpace(filter))
            {
                string s = filter.Trim().ToLowerInvariant();

                if (s == "title") subTasks = subTasks.OrderBy(st => st.Title);
                else if (s == "title_desc") subTasks = subTasks.OrderByDescending(st => st.Title);
                else if (s == "status") subTasks = subTasks.OrderBy(st => st.Status);
                else if (s == "status_desc") subTasks = subTasks.OrderByDescending(st => st.Status);
            }

            return subTasks.ToList();
        }

        public SubTask? GetSubTaskById(int taskId, int id)
        {
            return _context.SubTasks
                .FirstOrDefault(st => st.Id == id && st.ATaskId == taskId && !st.IsDeleted);
        }

        public SubTask? CreateSubTask(int taskId, string title, string description)
        {
            var task = _context.Tasks.FirstOrDefault(t => t.Id == taskId && !t.IsDeleted);
            if (task == null)
            {
                return null;
            }

            var subTask = new SubTask
            {
                Title = title,
                Description = description,
                Status = MyEnum.Status.InProgress,
                ATaskId = taskId,
                IsDeleted = false,
                DeletedAt = DateTime.MinValue
            };

            _context.SubTasks.Add(subTask);
            _context.SaveChanges();

            return subTask;
        }

        public List<SubTask> GetDeletedSubTasks(int taskId)
        {
            return _context.SubTasks
                .Where(st => st.ATaskId == taskId && st.IsDeleted)
                .ToList();
        }

        public bool DeleteSubTask(int taskId, int id)
        {
            var subTaskToDelete = _context.SubTasks.FirstOrDefault(st => st.Id == id && st.ATaskId == taskId && !st.IsDeleted);
            if (subTaskToDelete == null)
            {
                return false;
            }

            subTaskToDelete.IsDeleted = true;
            subTaskToDelete.DeletedAt = DateTime.UtcNow;
            _context.SaveChanges();

            return true;
        }

        public bool RestoreSubTask(int taskId, int id)
        {
            var subTask = _context.SubTasks.FirstOrDefault(st => st.Id == id && st.ATaskId == taskId && st.IsDeleted);
            if (subTask == null)
            {
                return false;
            }

            subTask.IsDeleted = false;
            _context.SaveChanges();

            return true;
        }

        public bool EditSubTask(int taskId, int id,
            string? title,
            string? description,
            MyEnum.Status? status)
        {
            SubTask? subTask = _context.SubTasks.FirstOrDefault(st => st.Id == id && st.ATaskId == taskId && !st.IsDeleted);

            bool flag = false;

            if (subTask == null)
            {
                return false;
            }

            if (!string.IsNullOrWhiteSpace(title))
            {
                SubTaskDomain.EditSubTaskTitle(subTask, title);
                flag = true;
            }
            if (!string.IsNullOrWhiteSpace(description))
            {
                SubTaskDomain.EditSubTaskDescription(subTask, description);
                flag = true;
            }
            if (status.HasValue)
            {
                SubTaskDomain.ChangeSubTaskStatus(subTask, status.Value);
                flag = true;
            }

            if (flag)
            {
                _context.SaveChanges();
            }

            return flag;
        }

        public void PermDeleteSubTask(int taskId)
        {
            var subTasksToDelete = _context.SubTasks
                .Where(st => st.ATaskId == taskId && st.IsDeleted && (DateTime.UtcNow - st.DeletedAt).TotalHours > 72)
                .ToList();

            _context.SubTasks.RemoveRange(subTasksToDelete);
            _context.SaveChanges();
        }
    }
}
