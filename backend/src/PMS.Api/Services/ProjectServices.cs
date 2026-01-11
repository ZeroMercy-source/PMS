using Microsoft.EntityFrameworkCore;
using PMS.Api.Data;
using PMS.Api.Domain;
using PMS.Api.Models;

namespace PMS.Api.Services
{
    public class ProjectServices
    {
        private readonly PmsDbContext _context;

        public ProjectServices(PmsDbContext context)
        {
            _context = context;
        }

        public List<Project> GetProjects(string? search, string? filter, MyEnum.Priority? priority, MyEnum.Status? status)
        {
            IQueryable<Project> projects = _context.Projects
                .Include(p => p.Tasks)
                .Where(p => !p.IsDeleted);

            if (!string.IsNullOrWhiteSpace(search))
            {
                string lowerSearch = search.ToLower();
                projects = projects.Where(p =>
                    (p.Title ?? "").ToLower().Contains(lowerSearch) ||
                    (p.Description ?? "").ToLower().Contains(lowerSearch) ||
                    (p.Tasks != null && p.Tasks.Any(t =>
                        (t.Title ?? "").ToLower().Contains(lowerSearch) ||
                        (t.Description ?? "").ToLower().Contains(lowerSearch)
                    ))
                );
            }

            if (priority.HasValue)
            {
                projects = projects.Where(p => p.Priority == priority.Value);
            }

            if (status.HasValue)
            {
                projects = projects.Where(p => p.Status == status.Value);
            }

            if (!string.IsNullOrWhiteSpace(filter))
            {
                string s = filter.Trim().ToLowerInvariant();

                if (s == "title") projects = projects.OrderBy(p => p.Title);
                else if (s == "title_desc") projects = projects.OrderByDescending(p => p.Title);
                else if (s == "priority") projects = projects.OrderBy(p => p.Priority);
                else if (s == "priority_desc") projects = projects.OrderByDescending(p => p.Priority);
                else if (s == "status") projects = projects.OrderBy(p => p.Status);
                else if (s == "status_desc") projects = projects.OrderByDescending(p => p.Status);
            }

            return projects.ToList();
        }

        public Project? GetProjectById(int id)
        {
            return _context.Projects
                .Include(p => p.Tasks)
                    .ThenInclude(t => t.SubTasks)
                .FirstOrDefault(p => p.Id == id && !p.IsDeleted);
        }

        public Project CreateProject(string title, string description)
        {
            var project = new Project
            {
                Title = title,
                Description = description,
                Status = MyEnum.Status.InProgress,
                Priority = MyEnum.Priority.Low,
                UserId = 1,
                IsDeleted = false,
                DeletedAt = DateTime.MinValue
            };
            
            _context.Projects.Add(project);
            _context.SaveChanges();
            
            return project;
        }

        public List<Project> GetDeletedProjects()
        {
            return _context.Projects.Where(p => p.IsDeleted).ToList();
        }


        public bool DeleteProject(int id) 
        {
            var projectToDelete = _context.Projects.FirstOrDefault(p => p.Id == id && !p.IsDeleted);
            if (projectToDelete == null)
            {
                return false;
            }

            projectToDelete.IsDeleted = true;
            projectToDelete.DeletedAt = DateTime.UtcNow;
            _context.SaveChanges();
            
            return true;
        }

        public bool RestoreProject(int id)
        {
            var project = _context.Projects.FirstOrDefault(p => p.Id == id && p.IsDeleted);
            if (project == null)
            {
                return false;
            }

            project.IsDeleted = false;
            _context.SaveChanges();

            return true;
        }

        public bool EditProject(int id, 
            string? title, 
            string? description, 
            MyEnum.Status? status, 
            MyEnum.Priority? priority
            )
        {
            Project? project = _context.Projects.FirstOrDefault(p => p.Id == id && !p.IsDeleted);

            bool flag = false;

            if(project == null)
            {
               return false;
            }

            if (!string.IsNullOrWhiteSpace(title))
            {
                 ProjectDomain.EditProjectTitle(project, title);
                flag = true;
            }
            if (!string.IsNullOrWhiteSpace(description))
            {
               ProjectDomain.EditProjectDescription(project, description);
                flag = true;
            }
            if (status.HasValue)
            {
              
                ProjectDomain.ChangeProjectStatus(project, status.Value);
                flag = true;
                    
            }
            if (priority.HasValue)
            {

                ProjectDomain.ChangeProjectPriority(project, priority.Value);
                flag = true;

            }

            if (flag)
            {
                _context.SaveChanges();
            }

            return flag;
        }

        public void PermDeleteProject()
        {
            var projectsToDelete = _context.Projects
                .Where(p => p.IsDeleted && (DateTime.UtcNow - p.DeletedAt).TotalHours > 72)
                .ToList();
            
            _context.Projects.RemoveRange(projectsToDelete);
            _context.SaveChanges();
        }

    }
}
