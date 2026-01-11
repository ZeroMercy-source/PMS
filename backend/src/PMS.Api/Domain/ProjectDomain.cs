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

       

        public static void EditProjectTitle(Project project, string title)
        {
             project.Title = title;
        }

        public static void EditProjectDescription(Project project, string description)
        {
            project.Description = description;
        }

        public static void ChangeProjectStatus(Project project, MyEnum.Status status)
        {

            if (!Enum.IsDefined(typeof(MyEnum.Status), status))
            {
                throw new ArgumentException("Invalid Status Change");
            }

            project.Status = status;
        }

        public static void ChangeProjectPriority(Project project, MyEnum.Priority priority)
        {
            if (!Enum.IsDefined(typeof(MyEnum.Priority), priority))
            {
                throw new ArgumentException("Invalid Priority Change");
            }

            project.Priority = priority;
        }




    }


}
        

    

