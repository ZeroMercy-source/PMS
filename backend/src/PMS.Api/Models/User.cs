namespace PMS.Api.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = "ADMIN";

        public List<Project> Projects { get; set; } = new List<Project>();



    }
}
