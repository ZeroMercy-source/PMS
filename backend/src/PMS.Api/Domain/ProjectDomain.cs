using PMS.Api;
using PMS.Api.Models;

namespace PMS.Api.Domain
{
    public class ProjectDomain
    {

        public static void CreateProject(User user, Project project,
            int Id,
            string Title = "First Task",
            string Description = "No Description",
            MyEnum.Status Status = MyEnum.Status.InProgress, MyEnum.Priority Priority = MyEnum.Priority.Low)
        {
            user.Projects.Add(
            new Project
            {
                Title = Title,
                Description = Description,
                Id = Id,
                Status = Status,
                Priority = Priority
            });

        }

        public static void DeleteProject(User user, Project project)
        {
            project.DeletedAt = DateTime.UtcNow;
            user.DeletedProjects.Add(project);
            user.Projects.Remove(project);
        }

        public static void PermDeleteProject(User user, Project project)
        {
            user.DeletedProjects.RemoveAll(Project => (DateTime.UtcNow - Project.DeletedAt).TotalHours > 72);
        }

        public static void EditTaskTitle(Project project, string title)
        {
            project.Title = title;
        }

        public static void EditTaskDescription(Project project, string description)
        {
            project.Description = description;
        }

        public static void ChangeTaskStatus(Project project, MyEnum.Status status)
        {
            project.Status = status;
        }

        public static void ChangeTaskPriority(Project project, MyEnum.Priority priority)
        {
            project.Priority = priority;
        }




    }


}
        

    

