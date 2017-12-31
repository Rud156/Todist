﻿using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using TodoAspNetCore.Models;

namespace TodoAspNetCore.Services
{
    public class DataService : IDataService
    {
        private IMongoClient _client;
        private IMongoDatabase _database;
        private IMongoCollection<TodoItem> _todoCollection;
        private IMongoCollection<User> _userCollection;

        private static string databaseName = "asp_net_todo";

        private string mLabDB = $"mongodb://rud156:1234@ds163826.mlab.com:63826/{databaseName}";
        private string localDB = $"mongodb://localhost:27017/{databaseName}";

        public MinimalUser FormatUser(User user)
        {
            return new MinimalUser
            {
                Username = user.Username,
                Categories = user.Categories
            };
        }

        private List<TodoItem> FormatTodoList(List<TodoItem> todos)
        {
            return todos.Select(_ =>
            {
                _.Title = WebUtility.HtmlDecode(_.Title);
                _.Note = WebUtility.HtmlDecode(_.Note);
                return _;
            }).ToList();
        }

        private TodoItem FormatTodoItem(TodoItem todo)
        {
            todo.Title = WebUtility.HtmlDecode(todo.Title);
            todo.Note = WebUtility.HtmlDecode(todo.Note);
            return todo;
        }

        public DataService() => ConnectToDatabase();

        public void ConnectToDatabase()
        {
            MongoUrl mongoUrl = new MongoUrl(mLabDB);
            _client = new MongoClient(mongoUrl);
            _database = _client.GetDatabase(databaseName);
            /* bool mongoLive = _database.RunCommandAsync((Command<BsonDocument>)"{ping:1}").Wait(1000);
            if (mongoLive)
                Console.WriteLine("Database connection successful");
            else
                throw new Exception("Unable to connect to database. Aborting..."); */

            _todoCollection = _database.GetCollection<TodoItem>("todo");
            _userCollection = _database.GetCollection<User>("user");
        }

        public async Task<MinimalUser> CreateCategory(string username, string categoryName)
        {
            var userTask = await _userCollection.FindAsync(_ => _.Username == username);
            User user = await userTask.SingleOrDefaultAsync();

            if (user == null)
                return null;
            if (user.Categories.Contains(categoryName))
                return null;

            user.Categories.Add(categoryName);
            ReplaceOneResult replaceUser = await _userCollection.ReplaceOneAsync(_ => _.Username == username, user);
            return FormatUser(user);
        }

        public async Task<TodoItem> AddNewTodo(NewTodo newTodo)
        {
            newTodo.Username = newTodo.Username.ToLower();
            var userTask = await _userCollection.FindAsync(_ => _.Username == newTodo.Username);
            User user = await userTask.SingleOrDefaultAsync();
            if (user == null)
                return null;

            if (!user.Categories.Contains(newTodo.Category))
                return null;

            var todo = new TodoItem
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Title = WebUtility.HtmlEncode(newTodo.Title),
                Category = newTodo.Category,
                Username = newTodo.Username,
                Completed = false,
                StartDate = DateTime.UtcNow.Date.Ticks,
                Priority = 1,
                DueDate = DateTime.UtcNow.Date.AddDays(1).Ticks,
                Note = ""
            };

            await _todoCollection.InsertOneAsync(todo);
            return FormatTodoItem(todo);
        }

        public async Task<IEnumerable<TodoItem>> GetAllTodos(string username)
        {
            username = username.ToLower();
            var task = await _todoCollection.FindAsync(_ => _.Username == username);
            List<TodoItem> todoList = await task.ToListAsync();
            return FormatTodoList(todoList);
        }

        public async Task<TodoItem> GetTodo(string id)
        {
            var task = await _todoCollection.FindAsync(_ => _.Id == id);
            TodoItem todo = await task.SingleOrDefaultAsync();
            return FormatTodoItem(todo);
        }

        public async Task<IEnumerable<TodoItem>> GetCompletedTodos(string username)
        {
            username = username.ToLower();
            var task = await _todoCollection.FindAsync(_ => _.Username == username && _.Completed);
            List<TodoItem> todoList = await task.ToListAsync();
            return FormatTodoList(todoList);
        }

        public async Task<IEnumerable<TodoItem>> GetInCompletedTodos(string username)
        {
            username = username.ToLower();
            var task = await _todoCollection.FindAsync(_ => _.Username == username && !_.Completed);
            List<TodoItem> todoList = await task.ToListAsync();
            return FormatTodoList(todoList);
        }

        public async Task<IEnumerable<TodoItem>> GetTodoByPriority(string username, int priority)
        {
            username = username.ToLower();
            var task = await _todoCollection.FindAsync(_ => _.Username == username && _.Priority == priority);
            List<TodoItem> todoList = await task.ToListAsync();
            return FormatTodoList(todoList);
        }

        public async Task<IEnumerable<TodoItem>> GetTodoByCategory(string username, string category)
        {
            username = username.ToLower();
            var task = await _todoCollection.FindAsync(_ => _.Username == username && _.Category == category);
            List<TodoItem> todoList = await task.ToListAsync();
            return FormatTodoList(todoList);
        }

        public async Task<IEnumerable<TodoItem>> GetTodosDueOnDate(string username, DateTime dateTime)
        {
            username = username.ToLower();
            var task = await _todoCollection.FindAsync(_ => _.Username == username && _.DueDate == dateTime.Ticks);
            List<TodoItem> todoList = await task.ToListAsync();
            return FormatTodoList(todoList);
        }

        public async Task<IEnumerable<TodoItem>> GetTodosStartingOnDate(string username, DateTime dateTime)
        {
            username = username.ToLower();
            var task = await _todoCollection.FindAsync(_ => _.Username == username && _.StartDate == dateTime.Ticks);
            List<TodoItem> todoList = await task.ToListAsync();
            return FormatTodoList(todoList);
        }

        public async Task<bool> RenameCategory(string username, string category, string newCategoryName)
        {
            var userTask = await _userCollection.FindAsync(_ => _.Username == username);
            var user = await userTask.SingleOrDefaultAsync();
            if (user == null || !user.Categories.Contains(category) || user.Categories.Contains(newCategoryName))
                return false;

            user.Categories.Remove(category);
            user.Categories.Add(newCategoryName);

            ReplaceOneResult replaceUser = await _userCollection.ReplaceOneAsync(
                _ => _.Username == username,
                user
                );

            UpdateResult updateMany = await _todoCollection.UpdateManyAsync(_ => _.Category == category && _.Username == username,
                Builders<TodoItem>.Update.Set(_ => _.Category, newCategoryName));
            return updateMany.IsAcknowledged;
        }

        public async Task<TodoItem> UpdateTodo(ModifiedTodo modifiedTodo)
        {
            var task = await _todoCollection.FindAsync(_ => _.Id == modifiedTodo.Id);
            TodoItem todoItem = await task.SingleOrDefaultAsync();

            if (todoItem == null)
                return null;

            todoItem.DueDate = modifiedTodo.DueDate.Date.Ticks;
            todoItem.Note = WebUtility.HtmlEncode(modifiedTodo.Note);
            todoItem.Priority = modifiedTodo.Priority;

            ReplaceOneResult modifiedTask = await _todoCollection.ReplaceOneAsync(_ => _.Id == modifiedTodo.Id, todoItem);
            return FormatTodoItem(todoItem);
        }

        public async Task<TodoItem> MarkComplete(string id)
        {
            var task = await _todoCollection.FindAsync(_ => _.Id == id);
            TodoItem todoItem = await task.SingleOrDefaultAsync();

            todoItem.Completed = true;
            ReplaceOneResult modifiedTask = await _todoCollection.ReplaceOneAsync(_ => _.Id == id, todoItem);
            return FormatTodoItem(todoItem);
        }

        public async Task<TodoItem> MarkIncomplete(string id)
        {
            var task = await _todoCollection.FindAsync(_ => _.Id == id);
            TodoItem todoItem = await task.SingleOrDefaultAsync();

            todoItem.Completed = false;
            ReplaceOneResult modifiedTask = await _todoCollection.ReplaceOneAsync(_ => _.Id == id, todoItem);
            return FormatTodoItem(todoItem);
        }

        public async Task<TodoItem> ChangePriority(string id, int priority)
        {
            var task = await _todoCollection.FindAsync(_ => _.Id == id);
            TodoItem todoItem = await task.SingleOrDefaultAsync();

            if (todoItem == null)
                return null;

            todoItem.Priority = priority;
            ReplaceOneResult modifiedPriority = await _todoCollection.ReplaceOneAsync(_ => _.Id == id, todoItem);
            return modifiedPriority.IsAcknowledged ? FormatTodoItem(todoItem) : null;
        }

        public async Task<TodoItem> RemoveTodo(string id)
        {
            var getTodoTask = await _todoCollection.FindAsync(_ => _.Id == id);
            TodoItem todoItem = getTodoTask.SingleOrDefault();

            var task = await _todoCollection.DeleteOneAsync(_ => _.Id == id);

            if (task.IsAcknowledged)
                return FormatTodoItem(todoItem);
            else
                return null;
        }

        public async Task<long> RemoveCompleted(string username)
        {
            username = username.ToLower();
            var task = await _todoCollection.DeleteManyAsync(_ => _.Completed && _.Username == username);

            if (task.IsAcknowledged)
                return task.DeletedCount;
            else
                return 0;
        }

        public async Task<long> RemoveCompleted(string username, string category)
        {
            username = username.ToLower();
            var task = await _todoCollection.DeleteManyAsync(_ =>
                _.Completed &&
                _.Username == username &&
                _.Category == category);

            if (task.IsAcknowledged)
                return task.DeletedCount;
            else
                return 0;
        }

        public async Task<bool> RemoveCategory(string username, string category)
        {
            username = username.ToLower();

            var userTask = await _userCollection.FindAsync(_ => _.Username == username);
            User user = await userTask.SingleOrDefaultAsync();
            user.Categories.Remove(category);
            ReplaceOneResult replaceUser = await _userCollection.ReplaceOneAsync(_ => _.Username == username, user);

            var task = await _todoCollection.DeleteManyAsync(_ =>
                _.Username == username &&
                _.Category == category);

            return task.IsAcknowledged;
        }

        public async Task<MinimalUser> AddNewUser(NewUser newUser)
        {
            newUser.Username = newUser.Username.ToLower();
            var user = await _userCollection.FindAsync(_ => _.Username == newUser.Username);
            bool userExists = await user.AnyAsync();

            if (userExists)
                return null;

            byte[] salt = new byte[128 / 8];
            string hashedPassword = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: newUser.Password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8
            ));

            var userObject = new User
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Username = newUser.Username,
                Password = hashedPassword,
                Categories = new HashSet<string>(),
                UserSalt = salt
            };

            await _userCollection.InsertOneAsync(userObject);
            return FormatUser(userObject);
        }

        public async Task<MinimalUser> GetuserById(string id)
        {
            var task = await _userCollection.FindAsync(_ => _.Id == id);
            User user = await task.SingleOrDefaultAsync();
            return FormatUser(user);
        }

        public async Task<User> GetUserByUsername(string username)
        {
            username = username.ToLower();
            var task = await _userCollection.FindAsync(_ => _.Username == username);
            return await task.SingleOrDefaultAsync();
        }
    }
}