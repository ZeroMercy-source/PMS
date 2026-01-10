using PMS.Api.Domain;
using PMS.Api.Models;
using System.Runtime.Intrinsics.X86;

namespace PMS.Api.Services
{
    public class ProjectServices
    {
        private readonly User user1 = new User();

        public List<Project> GetProjects()
        {
            return user1.Projects;
        }

        public Project GetProjectById(int id)
        {
            return user1.Projects.FirstOrDefault(p => p.Id == id);
        }

        public Project CreateProject(string title, string description)
        {
            int id = user1.Projects.Count + 1;
            
            return ProjectDomain.CreateProject(user1, id, title, description);
        
        }
        public bool DeleteProject(int id) 
        {
         
            Project? project = user1.Projects.Find(p => p.Id == id);

            if (project == null)
            {
                return false;
            }

            return ProjectDomain.DeleteProject(user1, project);

        }

        public bool EditProject(int id, 
            string title, 
            string description, 
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
