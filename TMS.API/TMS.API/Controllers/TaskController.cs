using Microsoft.AspNetCore.Mvc;

namespace TMS.API.Controllers
{
    public class TaskController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
