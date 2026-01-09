using System.Linq;

namespace TMS.API.Models
{
    public class Project : WorkItems
    {
      
        public List<Task> Tasks { get; set; } = new List<Task>();

     
        

    }
}
