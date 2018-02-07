using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TodoAspNetCore.Models;

namespace TodoAspNetCore.Services
{
    public interface IDataService
    {
        Task<TodoItem> AddNewTodo(NewTodo newTodo);

        Task<MinimalUser> AddNewUser(NewUser newUser);

        Task<TodoItem> ChangePriority(string id, int priority);

        Task<MinimalUser> CreateCategory(string username, string categoryName);

        MinimalUser FormatUser(User user);

        Task<IEnumerable<TodoItem>> GetAllTodos(string username);

        Task<IEnumerable<TodoItem>> GetCompletedTodos(string username);

        Task<IEnumerable<TodoItem>> GetInCompletedTodos(string username);

        Task<MinimalUser> GetMinimalUserByUsername(string username);

        Task<TodoItem> GetTodo(string id);

        Task<IEnumerable<TodoItem>> GetTodoByCategory(string username, string category);

        Task<IEnumerable<TodoItem>> GetTodoByPriority(string username, int priority);

        Task<IEnumerable<TodoItem>> GetTodosDueOnDate(string username, DateTime dateTime);

        Task<IEnumerable<TodoItem>> GetTodosStartingOnDate(string username, DateTime dateTime);

        Task<IEnumerable<TodoItem>> GetTodosDueTillNow(string username, DateTime dateTime);

        Task<MinimalUser> GetuserById(string id);

        Task<User> GetUserByUsername(string username);

        Task<TodoItem> MarkComplete(string id);

        Task<TodoItem> MarkIncomplete(string id);

        Task<bool> RemoveCategory(string username, string category);

        Task<long> RemoveCompleted(string username);

        Task<long> RemoveCompleted(string username, string category);

        Task<TodoItem> RemoveTodo(string id);

        Task<bool> RenameCategory(string username, string category, string newCategoryName);

        Task<TodoItem> UpdateTodo(ModifiedTodo modifiedTodo);

        Task<IEnumerable<TodoItem>> SearchTodo(string username, string query);
    }
}