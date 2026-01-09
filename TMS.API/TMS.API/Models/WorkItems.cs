namespace TMS.API.Models
{
    public abstract class WorkItems
    {
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string Text { get; set; } = "No Text";
        public string Description { get; set; } = "No Description";
        public int Id { get; set; }
        public MyEnum.Status Status { get; set; }
        public MyEnum.Priority Priority { get; set; }


    }
}
