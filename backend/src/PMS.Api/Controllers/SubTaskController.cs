using Microsoft.AspNetCore.Mvc;
using PMS.Api.Dtos;
using PMS.Api.Models;
using PMS.Api.Services;

namespace PMS.Api.Controllers
{
    [ApiController]
    [Route("projects/{projectId}/tasks/{taskId}/subtasks")]
    public class SubTaskController : Controller
    {
        private readonly SubTaskServices _subTaskService;

        public SubTaskController(SubTaskServices subTaskService)
        {
            _subTaskService = subTaskService;
        }

        [HttpGet]
        public IActionResult GetSubTasksList(int taskId, string? search, string? sort, MyEnum.Status? status)
        {
            List<SubTask> subTasks = _subTaskService.GetSubTasks(taskId, search, sort, status);
            return Ok(subTasks);
        }

        [HttpGet("deleted")]
        public IActionResult GetDeletedSubTasks(int taskId)
        {
            List<SubTask> deletedSubTasks = _subTaskService.GetDeletedSubTasks(taskId);
            return Ok(deletedSubTasks);
        }

        [HttpGet("{id}")]
        public IActionResult GetSubTask(int taskId, int id)
        {
            SubTask? subTask = _subTaskService.GetSubTaskById(taskId, id);
            if (subTask == null) return NotFound();
            return Ok(subTask);
        }

        [HttpPost]
        public IActionResult CreateSubTask(int taskId, [FromBody] CreateSubTaskRequest create)
        {
            if (string.IsNullOrWhiteSpace(create.Title) || string.IsNullOrWhiteSpace(create.Description))
            {
                return BadRequest("SubTask Needs a Title and Description to be Created");
            }

            var subTask = _subTaskService.CreateSubTask(taskId, create.Title, create.Description);
            if (subTask == null)
            {
                return NotFound("Task not found");
            }

            return Ok(subTask);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteSubTask(int taskId, int id)
        {
            bool deleted = _subTaskService.DeleteSubTask(taskId, id);
            if (deleted)
            {
                return NoContent();
            }
            return NotFound();
        }

        [HttpPatch("{id}/restore")]
        public IActionResult RestoreSubTask(int taskId, int id)
        {
            bool restored = _subTaskService.RestoreSubTask(taskId, id);
            if (restored)
            {
                return NoContent();
            }
            return NotFound();
        }

        [HttpPatch("{id}")]
        public IActionResult EditSubTask(int taskId, int id, [FromBody] UpdateSubTaskRequest update)
        {
            try
            {
                bool updated = _subTaskService.EditSubTask(
                    taskId,
                    id,
                    update.Title,
                    update.Description,
                    update.Status
                );

                if (updated)
                {
                    return NoContent();
                }

                return NotFound();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
