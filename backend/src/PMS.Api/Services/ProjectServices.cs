using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.OpenApi;
using PMS.Api.Domain;
using PMS.Api.Models;
using System.Runtime.Intrinsics.X86;
using System.Threading.Tasks;

namespace PMS.Api.Services
{
    public class ProjectServices
    {
        private readonly User user1 = new User();

        public ProjectServices()
        {
            
        }

        public List<Project> GetProjects(string? search, string? filter, MyEnum.Priority? priority, MyEnum.Status? status)
        {
            IEnumerable<Project> projects = user1.Projects.Where(p => !p.IsDeleted);

            if (!string.IsNullOrWhiteSpace(search))
            {
                projects = projects.Where(p =>
                    (p.Title ?? "").Contains(search, StringComparison.OrdinalIgnoreCase) ||
                    (p.Description ?? "").Contains(search, StringComparison.OrdinalIgnoreCase) ||
                    (p.Tasks != null && p.Tasks.Any(t =>
                        (t.Title ?? "").Contains(search, StringComparison.OrdinalIgnoreCase) ||
                        (t.Description ?? "").Contains(search, StringComparison.OrdinalIgnoreCase)
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
            return user1.Projects.FirstOrDefault(p => p.Id == id);
        }

        public Project CreateProject(string title, string description)
        {

            int id = user1.Projects.Count + 1;
            
            return ProjectDomain.CreateProject(user1, id, title, description);
        
        }

        public List<Project> GetDeletedProjects()
        {
            return user1.Projects.Where(p => p.IsDeleted).ToList();
        }


        public bool DeleteProject(int id) 
        {

            var ProjectToDelete = user1.Projects.Find(p => p.Id == id);
            if (ProjectToDelete == null)
            {
                return false;
            }

            ProjectToDelete.IsDeleted = true;
            ProjectToDelete.DeletedAt = DateTime.UtcNow;
            return true;

        }

        public bool RestoreProject(int id)
        {
            var project = user1.Projects.FirstOrDefault(p => p.Id == id && p.IsDeleted);
            if (project == null)
            {
                return false;
            }

            project.IsDeleted = false;

            return true;
        }

        public bool EditProject(int id, 
            string? title, 
            string? description, 
            MyEnum.Status? status, 
            MyEnum.Priority? priority
            )
        {
            Project? project = user1.Projects.Find(p => p.Id == id);

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

            return flag;
        }

        public static void PermDeleteProject(User user)
        {
            user.DeletedProjects.RemoveAll(Project => (DateTime.UtcNow - Project.DeletedAt).TotalHours > 72);

        }

    }
}
