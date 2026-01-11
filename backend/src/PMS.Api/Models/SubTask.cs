using Microsoft.EntityFrameworkCore;

namespace PMS.Api.Models
{
    [Index(nameof(ATaskId), nameof(IsDeleted))]
    public class SubTask : WorkItems
    {

        public int ATaskId { get; set; }


    }
}
