using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TodoAspNetCore.Models;

namespace TodoAspNetCore.Services
{
    public interface IDataService
    {
        MinimalUser FormatUser(User user);

        Task<MinimalUser> CreateCategory(string username, string categoryName);

        Task<TodoItem> AddNewTodo(NewTodo newTodo);

        Task<IEnumerable<TodoItem>> GetAllTodos(string username);

        Task<TodoItem> GetTodo(string id);

        Task<IEnumerable<TodoItem>> GetCompletedTodos(string username);

        Task<IEnumerable<TodoItem>> GetInCompletedTodos(string username);

        Task<IEnumerable<TodoItem>> GetTodoByPriority(string username, int priority);

        Task<IEnumerable<TodoItem>> GetTodoByCategory(string username, string category);

        Task<IEnumerable<TodoItem>> GetTodosDueOnDate(string username, DateTime dateTime);

        Task<IEnumerable<TodoItem>> GetTodosStartingOnDate(string username, DateTime dateTime);

        Task<bool> RenameCategory(string username, string category, string newCategoryName);

        Task<TodoItem> UpdateTodo(ModifiedTodo modifiedTodo);

        Task<TodoItem> MarkComplete(string id);

        Task<TodoItem> MarkIncomplete(string id);

        Task<TodoItem> ChangePriority(string id, int priority);

        Task<TodoItem> RemoveTodo(string id);

        Task<long> RemoveCompleted(string username);

        Task<long> RemoveCompleted(string username, string category);

        Task<bool> RemoveCategory(string username, string category);

        Task<MinimalUser> AddNewUser(NewUser newUser);

        Task<MinimalUser> GetuserById(string id);

        Task<User> GetUserByUsername(string username);
    }
}