using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TodoAspNetCore.Authentication;
using TodoAspNetCore.Models;
using TodoAspNetCore.Services;

namespace TodoAspNetCore.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    [Authorize]
    public class UserController : Controller
    {
        private readonly IDataService _dataService;

        private string GetUsername(HttpContext context)
        {
            ClaimsPrincipal currentUser = context.User;
            if (currentUser.HasClaim(_ => _.Type == ClaimTypes.Name))
                return currentUser.Claims.FirstOrDefault(_ => _.Type == ClaimTypes.Name).Value;
            else
                return "";
        }

        private DeafultMessage InvalidUser(string username)
        {
            return new DeafultMessage
            {
                success = false,
                message = $"User {username} does not exist"
            };
        }

        public UserController(IDataService dataService)
        {
            _dataService = dataService;
        }

        [HttpGet]
        [ActionName("get_user")]
        public async Task<object> GetUser()
        {
            string username = GetUsername(HttpContext);
            MinimalUser user = await _dataService.GetMinimalUserByUsername(username);
            if (user == null)
                return Unauthorized();
            else
            {
                string token = JWTToken.GenerateToken(user.Username);
                return Ok(new
                {
                    success = true,
                    user,
                    token
                });
            }
        }
    }
}