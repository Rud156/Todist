using System;
using System.ComponentModel.DataAnnotations;

namespace TodoAspNetCore.Models
{
    public class NewTodo
    {
        [Required]
        [MinLength(1)]
        public string Title { get; set; }

        [Required]
        public string Category { get; set; }

        public string Username { get; set; }
    }
}