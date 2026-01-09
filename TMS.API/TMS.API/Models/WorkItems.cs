namespace TMS.API.Models
{
    public abstract class WorkItems
    {
        public DateTime CreatedAt { get; set; }
        public string Title { get; set; } = "No Title";
        public string Description { get; set; } = "No Description";
        public int Id { get; set; }
        public MyEnum.Status Status { get; set; }
        public MyEnum.Priority Priority { get; set; }


    }
}
