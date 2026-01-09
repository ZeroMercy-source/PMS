namespace TMS.API.Models
{
    public class User
    {

        public string Name { get; set; } = "ADMIN";

        List<Project> Projects = new List<Project>();


    }
}
