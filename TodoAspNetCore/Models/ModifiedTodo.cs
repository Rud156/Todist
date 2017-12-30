using System;
using System.ComponentModel.DataAnnotations;

namespace TodoAspNetCore.Models
{
    public class ModifiedTodo
    {
        [Required]
        public string Id { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        [Required]
        public string Note { get; set; }

        [Required]
        public int Priority { get; set; }
    }
}