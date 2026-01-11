using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace PMS.Api.Models
{
    [Index(nameof(UserId), nameof(IsDeleted))]
    [Index(nameof(IsDeleted), nameof(Priority))]
    public class Project : WorkItems
    {
        public int UserId { get; set; }
        public List<ATask> Tasks { get; set; } = new List<ATask>();

        public MyEnum.Priority Priority { get; set; }

    }
}
