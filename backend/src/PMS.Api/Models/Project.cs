using System.Linq;

namespace PMS.Api.Models
{
    public class Project : WorkItems
    {
      
        public List<ATask> Tasks { get; set; } = new List<ATask>();

        public MyEnum.Priority Priority { get; set; }

    }
}
