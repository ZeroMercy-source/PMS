using Microsoft.AspNetCore.Mvc;

namespace TMS.API.Controllers
{
    public class ProjectController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
