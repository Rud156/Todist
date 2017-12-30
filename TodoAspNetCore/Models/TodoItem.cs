using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TodoAspNetCore.Models
{
    public class TodoItem
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Title { get; set; }
        public long DueDate { get; set; }
        public long StartDate { get; set; }
        public int Priority { get; set; }
        public bool Completed { get; set; }
        public string Category { get; set; }
        public string Note { get; set; }
        public string Username { get; set; }
    }
}