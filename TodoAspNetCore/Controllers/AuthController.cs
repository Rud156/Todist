using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TodoAspNetCore.Authentication;
using TodoAspNetCore.Models;
using TodoAspNetCore.Services;

namespace TodoAspNetCore.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    public class AuthController : Controller
    {
        private readonly IDataService _dataService;

        public AuthController(IDataService dataService)
        {
            _dataService = dataService;
        }

        [HttpPost]
        [ActionName("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody]NewUser user)
        {
            if (!ModelState.IsValid)
                return BadRequest(new DeafultMessage
                {
                    success = false,
                    message = "Credentials do not match format specified"
                });

            MinimalUser userObject = await _dataService.AddNewUser(user);
            if (userObject == null)
                return BadRequest(new DeafultMessage
                {
                    success = false,
                    message = $"Unable to register {user.Username}. User already exists"
                });

            return Ok(new
            {
                success = true,
                message = $"Successfully registered {user.Username}",
                userObject
            });
        }

        [HttpPost]
        [ActionName("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody]NewUser user)
        {
            if (!ModelState.IsValid)
                return BadRequest(new DeafultMessage
                {
                    success = false,
                    message = "Credentials do not match the format specified"
                });

            var potentialUser = await _dataService.GetUserByUsername(user.Username);
            if (potentialUser == null)
                return BadRequest(new DeafultMessage
                {
                    success = false,
                    message = $"User {user.Username} does not exist"
                });

            byte[] salt = potentialUser.UserSalt;
            string hashPassword = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: user.Password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8
            ));

            if (hashPassword == potentialUser.Password)
            {
                string token = JWTToken.GenerateToken(potentialUser.Username);
                return Ok(new
                {
                    success = true,
                    message = "Logged in",
                    token,
                    user = _dataService.FormatUser(potentialUser)
                });
            }
            else
                return BadRequest(new DeafultMessage
                {
                    success = false,
                    message = "Passwords do not match"
                });
        }
    }
}