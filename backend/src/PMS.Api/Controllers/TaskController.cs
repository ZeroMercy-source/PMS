using Microsoft.AspNetCore.Mvc;
using PMS.Api.Dtos;
using PMS.Api.Models;
using PMS.Api.Services;

namespace PMS.Api.Controllers
{
    [ApiController]
    [Route("projects/{projectId}/tasks")]
    public class TaskController : Controller
    {
        private readonly TaskServices _taskService;

        public TaskController(TaskServices taskService)
        {
            _taskService = taskService;
        }

        [HttpGet]
        public IActionResult GetTasksList(int projectId, string? search, string? sort, MyEnum.Priority? priority, MyEnum.Status? status)
        {
            List<ATask> tasks = _taskService.GetTasks(projectId, search, sort, priority, status);
            return Ok(tasks);
        }

        [HttpGet("deleted")]
        public IActionResult GetDeletedTasks(int projectId)
        {
            List<ATask> deletedTasks = _taskService.GetDeletedTasks(projectId);
            return Ok(deletedTasks);
        }

        [HttpGet("{id}")]
        public IActionResult GetTask(int projectId, int id)
        {
            ATask? task = _taskService.GetTaskById(projectId, id);
            if (task == null) return NotFound();
            return Ok(task);
        }

        [HttpPost]
        public IActionResult CreateTask(int projectId, [FromBody] CreateTaskRequest create)
        {
            if (string.IsNullOrWhiteSpace(create.Title) || string.IsNullOrWhiteSpace(create.Description))
            {
                return BadRequest("Task Needs a Title and Description to be Created");
            }

            var task = _taskService.CreateTask(projectId, create.Title, create.Description);
            if (task == null)
            {
                return NotFound("Project not found");
            }

            return Ok(task);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTask(int projectId, int id)
        {
            bool deleted = _taskService.DeleteTask(projectId, id);
            if (deleted)
            {
                return NoContent();
            }
            return NotFound();
        }

        [HttpPatch("{id}/restore")]
        public IActionResult RestoreTask(int projectId, int id)
        {
            bool restored = _taskService.RestoreTask(projectId, id);
            if (restored)
            {
                return NoContent();
            }
            return NotFound();
        }

        [HttpPatch("{id}")]
        public IActionResult EditTask(int projectId, int id, [FromBody] UpdateTaskRequest update)
        {
            try
            {
                bool updated = _taskService.EditTask(
                    projectId,
                    id,
                    update.Title,
                    update.Description,
                    update.Status,
                    update.Priority
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

