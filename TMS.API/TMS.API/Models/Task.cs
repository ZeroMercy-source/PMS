using TMS.API;

namespace TMS.API.Models
{
    public class Task : WorkItems
    {
        public List<SubTask> SubTasks = new List<SubTask>();
        public int ProjectId { get; set; }


    }

    public class SubTask : WorkItems
    {
      

        public int TaskId { get; set; } 

     


    }
}
