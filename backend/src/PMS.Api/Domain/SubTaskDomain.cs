using PMS.Api;
using PMS.Api.Models;

namespace PMS.Api.Domain
{
    public class SubTaskDomain
    {
        public static void EditSubTaskTitle(SubTask subtask, string title)
        {
            subtask.Title = title;
        }

        public static void EditSubTaskDescription(SubTask subtask, string description)
        {
            subtask.Description = description;
        }

        public static void ChangeSubTaskStatus(SubTask subtask, MyEnum.Status status)
        {
            if (!Enum.IsDefined(typeof(MyEnum.Status), status))
            {
                throw new ArgumentException("Invalid Status Change");
            }

            subtask.Status = status;
        }
    }
}

