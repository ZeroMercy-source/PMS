namespace PMS.Api.Models
{
    public class User
    {
        public int id { get; set; }
        public string Name { get; set; } = "ADMIN";

        public List<Project> Projects = new List<Project>();

        public List<Project> DeletedProjects = new List<Project>();


    }
}
