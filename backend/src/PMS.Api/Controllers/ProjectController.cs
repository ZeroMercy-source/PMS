using Microsoft.AspNetCore.Mvc;
using PMS.Api.Dtos;
using PMS.Api.Models;
using PMS.Api.Services;

namespace PMS.Api.Controllers
{
    [ApiController]
    [Route("[Controller]")]
    public class ProjectController : Controller
    {
        private readonly ProjectServices _projectService;

        public ProjectController(ProjectServices projectService)
        {
            _projectService = projectService;
        }

        [HttpGet]
        public IActionResult GetProjectsList()
        {
            
            List<Project> projects = _projectService.GetProjects();
            return Ok(projects);
        }

        [HttpGet("{id}")]
        public IActionResult GetProject(int id)
        {
            
            Project project = _projectService.GetProjectById(id);
            if (project == null) return NotFound();
            return Ok(project);
        }

        [HttpPost]
        public IActionResult CreateProject([FromBody] CreateProjectRequest create)
        {
            
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

        [HttpPatch("{id}")]
        public IActionResult EditProject(int id, [FromBody] UpdateProjectRequest update)
        {

            try
            {

                bool updated = _projectService.EditProject(
                    id,
                    update.Title,
                    update.Description,
                    update.Priority,
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
