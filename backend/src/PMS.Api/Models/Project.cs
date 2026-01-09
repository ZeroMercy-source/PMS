using System.Linq;

namespace PMS.Api.Models
{
    public class Project : WorkItems
    {
      
        public List<Task> Tasks { get; set; } = new List<Task>();

     
        

    }
}
