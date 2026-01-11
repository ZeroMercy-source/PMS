using PMS.Api;
using PMS.Api.Models;

namespace PMS.Api.Domain
{
    public class TaskDomain
    {

        public static void CreateTask(Project project, ATask task,
            int Id,
            string Title = "First Task",
            string Description = "No Description",
            MyEnum.Status Status = MyEnum.Status.InProgress, MyEnum.Priority Priority = MyEnum.Priority.Low)
        {
            project.Tasks.Add(
            new ATask
            {
                Title = Title,
                Description = Description,
                Id = Id,
                Status = Status,
                Priority = Priority
            });

        }

        public static void DeleteTask(Project project, ATask task)
        {
            task.DeletedAt = DateTime.UtcNow;
          //  project.DeletedTasks.Add(task);
            project.Tasks.Remove(task);
        }

        public static void PermDeleteTask(Project project, ATask task)
        {
           // project.DeletedTasks.RemoveAll(Task => (DateTime.UtcNow - Task.DeletedAt).TotalHours > 72);
        }

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
            task.Status = status;
        }

        public static void ChangeTaskPriority(ATask task, MyEnum.Priority priority)
        {
            task.Priority = priority;
        }

    }


}
        

    

