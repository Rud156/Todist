using Microsoft.AspNetCore.Mvc;
using TodoAspNetCore.Models;

namespace TodoAspNetCore.Controllers
{
    [Produces("application/json")]
    [Route(""), Route("api")]
    public class HomeController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return Ok(new DeafultMessage
            {
                success = true,
                message = "Hello World"
            });
        }
    }
}