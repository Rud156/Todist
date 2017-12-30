using System.Collections.Generic;

namespace TodoAspNetCore.Models
{
    public class MinimalUser
    {
        public string Username { get; set; }
        public HashSet<string> Categories { get; set; }
    }
}