using Microsoft.EntityFrameworkCore;

namespace PMS.Api.Models
{
    [Index(nameof(ProjectId), nameof(IsDeleted))]
    public class ATask : WorkItems
    {
        
        public List<SubTask> SubTasks { get; set; } = new List<SubTask>();
        public int ProjectId { get; set; }

        public MyEnum.Priority Priority { get; set; }
    }

    
}
