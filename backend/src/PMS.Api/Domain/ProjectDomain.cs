using PMS.Api;
using PMS.Api.Models;

namespace PMS.Api.Domain
{
    public class ProjectDomain
    {

        public static Project CreateProject(User user, int id, string title, string description)
        {
            Project project = new Project();
            project.Status = MyEnum.Status.InProgress;
            project.Priority = MyEnum.Priority.Low;
            project.Id = id;
            project.Title = title;
            project.Description = description;
            user.Projects.Add(project);

            return project;
        }

        public static bool DeleteProject(User user,Project project)
        {
            project.DeletedAt = DateTime.UtcNow;
            user.DeletedProjects.Add(project);
            return user.Projects.Remove(project);
        }

        public static void PermDeleteProject(User user, Project project)
        {
            user.DeletedProjects.RemoveAll(Project => (DateTime.UtcNow - Project.DeletedAt).TotalHours > 72);
        }

        public static string EditProjectTitle(Project project, string title)
        {
            project.Title = title;
        }

        public static string EditProjectDescription(Project project, string description)
        {
            return project.Description = description;
        }

        public static void ChangeProjectStatus(Project project, MyEnum.Status status)
        {
            project.Status = status;
        }

        public static void ChangeProjectPriority(Project project, MyEnum.Priority priority)
        {
            project.Priority = priority;
        }




    }


}
        

    

