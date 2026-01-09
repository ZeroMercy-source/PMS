using TMS.API.Models;

namespace TMS.API.Services
{
    public class ProjectServices
    {
        private DateTime CurrentTime = DateTime.UtcNow; 

        public static void CreateProject(User user, int Id, 
            string Title = "First Task",
            string Description = "No Description",
            MyEnum.Status Status = MyEnum.Status.InProgress , MyEnum.Priority Priority = MyEnum.Priority.Low)
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

        public static void TempDeleteProject(User user, int Id, DateTime CurrentTime)
        {

            var ProjectToDelete = user.Projects.FirstOrDefault(Project => Project.Id == Id);



            if (ProjectToDelete != null)
            {

                user.DeletedProjects.Add(ProjectToDelete);
                ProjectToDelete.CreatedAt = DateTime.UtcNow;

            }

        


            if (user.DeletedProjects.ForEach(DeletedProject => {
                TimeSpan Elapsed = DeletedProject.CreatedAt - CurrentTime;
                Elapsed.TotalHours > 72

                    });
            //Possible Mistake here
            PermDeleteProject(user, Id);


        }


        public static void PermDeleteProject(User user, int Id)
        {
            user.Projects.RemoveAll(Project => Project.Id == Id);
        }


        public static void EditProjectTitle(User user, int Id, string Title)
        {

            var ProjectFound = user.Projects.FirstOrDefault(Project => Project.Id == Id);
            
            if (ProjectFound != null)
            {
                ProjectFound.Title = Title;
            }

                
        }

        public static void EditProjectDescription(User user, int Id, string Description)
        {

            var ProjectFound = user.Projects.FirstOrDefault(Project => Project.Id == Id);

            if (ProjectFound != null)
            {
                ProjectFound.Description = Description;
            }


        }


        public static void ChangeProjectStatus(User user, int Id, MyEnum.Status status)
        {
            var ProjectFound = user.Projects.FirstOrDefault(Project => Project.Id == Id);

            if (ProjectFound != null)
            {
                if(ProjectFound.Status == MyEnum.Status.ToDO)
                {
                    ProjectFound.Status = MyEnum.Status.InProgress;

                } else if(ProjectFound.Status == MyEnum.Status.InProgress)
                {
                    ProjectFound.Status = MyEnum.Status.Done;
                }
                else
                {
                    TempDeleteProject(user, Id);
                }
                
            }
        }








    }
}
