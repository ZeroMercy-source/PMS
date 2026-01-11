using PMS.Api;
using PMS.Api.Models;

namespace PMS.Api.Domain
{
    public class TaskDomain
    {
        public static void EditTaskTitle(ATask task, string title)
        {
            task.Title = title;
        }

        public static void EditTaskDescription(ATask task, string description)
        {
            task.Description = description;
        }

        public static void ChangeTaskStatus(ATask task, MyEnum.Status status)
        {
            if (!Enum.IsDefined(typeof(MyEnum.Status), status))
            {
                throw new ArgumentException("Invalid Status Change");
            }

            task.Status = status;
        }

        public static void ChangeTaskPriority(ATask task, MyEnum.Priority priority)
        {
            if (!Enum.IsDefined(typeof(MyEnum.Priority), priority))
            {
                throw new ArgumentException("Invalid Priority Change");
            }

            task.Priority = priority;
        }
    }
}

