using System.ComponentModel.DataAnnotations;

namespace TodoAspNetCore.Models
{
    public class NewUser
    {
        [Required]
        [RegularExpression(Constants.UsernameRegex)]
        public string Username { get; set; }

        [Required]
        [RegularExpression(Constants.PasswordRegex)]
        public string Password { get; set; }
    }
}