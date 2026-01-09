namespace TMS.API.Models
{
    public class User
    {

        public string Name { get; set; } = "ADMIN";

        public List<Project> Projects = new List<Project>();

        public List<Project> DeletedProjects = new List<Project>();


    }
}
