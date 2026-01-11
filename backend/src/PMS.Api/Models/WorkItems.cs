namespace PMS.Api.Models
{
    public abstract class WorkItems
    {
        public DateTime DeletedAt { get; set; }
        public bool IsDeleted { get; set; }
        public string Title { get; set; } = "No Title";
        public string Description { get; set; } = "No Description";
        public int Id { get; set; }
        public MyEnum.Status Status { get; set; }
    }
}
