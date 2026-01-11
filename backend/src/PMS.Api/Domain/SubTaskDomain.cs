using PMS.Api;
using PMS.Api.Models;

namespace PMS.Api.Domain
{
    public class SubTaskDomain
    {

        

        public static void CreateSubTask(ATask task, SubTask subtask,
            int Id,
            string Title = "First Task",
            string Description = "No Description",
            MyEnum.Status Status = MyEnum.Status.InProgress)
        {
                task.SubTasks.Add(
                new SubTask
                {
                    Title = Title,
                    Description = Description,
                    Id = Id,
                    Status = Status,
                });
            
        }

        public static void DeleteSubTask(ATask task, SubTask subtask)
        {
                subtask.DeletedAt = DateTime.UtcNow;
             //   task.DeletedSubTasks.Add(subtask);
                task.SubTasks.Remove(subtask);      
        }


        public static void PermDeleteSubTask(ATask task)
        {
          //  task.DeletedSubTasks.RemoveAll(SubTask => (DateTime.UtcNow - SubTask.DeletedAt).TotalHours > 72);
        }
       

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
            subtask.Status = status;
        }


    }


}
        

    

