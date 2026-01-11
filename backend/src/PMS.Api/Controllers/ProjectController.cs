using Microsoft.AspNetCore.Mvc;
using PMS.Api.Dtos;
using PMS.Api.Models;
using PMS.Api.Services;

namespace PMS.Api.Controllers
{
    [ApiController]
    [Route("projects")]
    public class ProjectController : Controller
    {
        private readonly ProjectServices _projectService;

        public ProjectController(ProjectServices projectService)
        {
            _projectService = projectService;
        }

        [HttpGet]
        public IActionResult GetProjectsList(string? search, string? sort, MyEnum.Priority? priority, MyEnum.Status? status)
        {
          
            List<Project> projects = _projectService.GetProjects(search, sort, priority, status);

            return Ok(projects);
        }

        [HttpGet("deleted")]
        public IActionResult GetDeletedProjects()
        {
            List<Project> DeletedProjects = _projectService.GetDeletedProjects();

            return Ok(DeletedProjects);
        }



        [HttpGet("{id}")]
        public IActionResult GetProject(int id)
        {
            
            Project? project = _projectService.GetProjectById(id);
            if (project == null) return NotFound();
            return Ok(project);
        }

        [HttpPost]
        public IActionResult CreateProject([FromBody] CreateProjectRequest create)
        {
            
            if (string.IsNullOrWhiteSpace(create.Title) || string.IsNullOrWhiteSpace(create.Description))
            {
                return BadRequest("Project Needs a Title and Description to be Created");
            }
                
            return Ok(_projectService.CreateProject(create.Title, create.Description));
            
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteProject(int id)
        {
            bool deleted = _projectService.DeleteProject(id);
            if (deleted)
            {
                return NoContent();
                
            }
            return NotFound();

        }


        [HttpPatch("{id}/restore")]
        public IActionResult RestoreProject(int id)
        {
            bool restored = _projectService.RestoreProject(id);
            if (restored)
            {
                return NoContent();
            }
            return NotFound();
        }



        [HttpPatch("{id}")]
        public IActionResult EditProject(int id, [FromBody] UpdateProjectRequest update)
        {

            try
            {

                bool updated = _projectService.EditProject(
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
