using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TodoAspNetCore.Models;
using TodoAspNetCore.Services;

namespace TodoAspNetCore.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    [Authorize]
    public class TodoController : Controller
    {
        private readonly IDataService _dataService;

        public TodoController(IDataService dataService)
        {
            _dataService = dataService;
        }

        private DeafultMessage InvalidUser(string username)
        {
            return new DeafultMessage
            {
                success = false,
                message = $"User {username} does not exist"
            };
        }

        private string GetUsername(HttpContext context)
        {
            ClaimsPrincipal currentUser = context.User;
            if (currentUser.HasClaim(_ => _.Type == ClaimTypes.Name))
                return currentUser.Claims.FirstOrDefault(_ => _.Type == ClaimTypes.Name).Value;
            else
                return "";
        }

        [ActionName("add_category")]
        [HttpPost]
        public async Task<object> AddCategory([FromQuery]string category)
        {
            string username = GetUsername(HttpContext);
            var user = await _dataService.CreateCategory(username, category);
            if (user == null)
                return BadRequest(new DeafultMessage
                {
                    success = false,
                    message = "User does not exists or catergory already exists"
                });
            else
                return Ok(new
                {
                    success = true,
                    message = $"Category({category}) created",
                    user
                });
        }

        [ActionName("add_todo")]
        [HttpPost]
        public async Task<object> AddNewTodo([FromBody] NewTodo newTodo)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            newTodo.Username = GetUsername(HttpContext);

            TodoItem todoItem = await _dataService.AddNewTodo(newTodo);
            if (todoItem == null)
            {
                var result = new JsonResult(new DeafultMessage
                {
                    success = false,
                    message = $"Invalid user({newTodo.Username}) requested or category not created."
                })
                {
                    StatusCode = 500
                };
                return result;
            }
            else
                return Ok(new
                {
                    success = true,
                    message = $"Successfully created todo with title: {newTodo.Title}",
                    todoItem
                });
        }

        [ActionName("all")]
        [HttpGet]
        public async Task<object> GetAllTodos()
        {
            string username = GetUsername(HttpContext);
            IEnumerable<TodoItem> todos = await _dataService.GetAllTodos(username);
            return Ok(new
            {
                success = true,
                todos
            });
        }

        [ActionName("category")]
        [HttpGet]
        public async Task<object> GetTodoByCategory([FromQuery]string category)
        {
            string username = GetUsername(HttpContext);
            IEnumerable<TodoItem> todos = await _dataService.GetTodoByCategory(username, category);
            return Ok(new
            {
                success = true,
                todos
            });
        }

        [ActionName("starting")]
        [HttpGet]
        public async Task<object> GetTodosStartingOnDate([FromQuery]DateTime dateTime)
        {
            string username = GetUsername(HttpContext);
            IEnumerable<TodoItem> todos = await _dataService.GetTodosStartingOnDate(username, dateTime);
            return Ok(new
            {
                success = true,
                todos
            });
        }

        [ActionName("due")]
        [HttpGet]
        public async Task<object> GetTodosDueOnDate([FromQuery]DateTime dateTime)
        {
            string username = GetUsername(HttpContext);
            IEnumerable<TodoItem> todos = await _dataService.GetTodosDueOnDate(username, dateTime);
            return Ok(new
            {
                success = true,
                todos
            });
        }

        [ActionName("")]
        [HttpGet]
        public async Task<object> GetTodo([FromQuery]string id)
        {
            bool parseSuccess = ObjectId.TryParse(id, out ObjectId objectId);
            if (!parseSuccess)
                return BadRequest(new DeafultMessage
                {
                    success = false,
                    message = "Invalid id requested"
                });

            TodoItem todoItem = await _dataService.GetTodo(objectId.ToString());
            if (todoItem != null)
                return Ok(new
                {
                    success = true,
                    todoItem
                });
            else
            {
                var response = new JsonResult(new DeafultMessage
                {
                    success = false,
                    message = $"Unable to find todo with id: {id}"
                })
                {
                    StatusCode = 404
                };
                return response;
            }
        }

        [ActionName("completed")]
        [HttpGet]
        public async Task<object> GetCompleted()
        {
            string username = GetUsername(HttpContext);
            IEnumerable<TodoItem> todos = await _dataService.GetCompletedTodos(username);
            return Ok(new
            {
                success = true,
                todos
            });
        }

        [ActionName("incomplete")]
        [HttpGet]
        public async Task<object> GetInComplete()
        {
            string username = GetUsername(HttpContext);
            IEnumerable<TodoItem> todos = await _dataService.GetInCompletedTodos(username);
            return Ok(new
            {
                success = true,
                todos
            });
        }

        [ActionName("priority")]
        [HttpGet]
        public async Task<object> GetTodoByPriority([FromQuery]int priority)
        {
            string username = GetUsername(HttpContext);
            IEnumerable<TodoItem> todos = await _dataService.GetTodoByPriority(username, priority);
            return Ok(new
            {
                success = true,
                todos
            });
        }

        [ActionName("update_todo")]
        [HttpPut]
        public async Task<object> UpdateTodo([FromBody]ModifiedTodo modifiedTodo)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            TodoItem todoItem = await _dataService.UpdateTodo(modifiedTodo);
            if (todoItem == null)
                return new JsonResult(new DeafultMessage
                {
                    success = false,
                    message = "Todo does not exist"
                })
                {
                    StatusCode = 404
                };
            else
                return Ok(new
                {
                    success = true,
                    message = "Todo updated",
                    todoItem
                });
        }

        [ActionName("complete_todo")]
        [HttpPatch]
        public async Task<object> CompleteTodo([FromQuery]string id)
        {
            bool parseSuccess = ObjectId.TryParse(id, out ObjectId objectId);
            if (!parseSuccess)
                return BadRequest(new DeafultMessage
                {
                    success = false,
                    message = "Invalid id requested"
                });

            TodoItem todoItem = await _dataService.MarkComplete(objectId.ToString());
            if (todoItem == null)
                return new JsonResult(new DeafultMessage
                {
                    success = false,
                    message = "Todo does not exist"
                })
                {
                    StatusCode = 404
                };
            else
                return Ok(new
                {
                    success = true,
                    message = "Todo marked as complete",
                    todoItem
                });
        }

        [ActionName("mark_incomplete_todo")]
        [HttpPatch]
        public async Task<object> MarkIncomplete([FromQuery]string id)
        {
            bool parseSuccess = ObjectId.TryParse(id, out ObjectId objectId);
            if (!parseSuccess)
                return BadRequest(new DeafultMessage
                {
                    success = false,
                    message = "Invalid id requested"
                });

            TodoItem todoItem = await _dataService.MarkIncomplete(objectId.ToString());
            if (todoItem == null)
                return new JsonResult(new DeafultMessage
                {
                    success = false,
                    message = "Todo does not exist"
                })
                {
                    StatusCode = 404
                };
            else
                return Ok(new
                {
                    success = true,
                    message = "Todo marked as incpmplete",
                    todoItem
                });
        }

        [ActionName("update_category")]
        [HttpPatch]
        public async Task<object> UpdateCategoryName([FromQuery]string category, [FromQuery]string newCategoryName)
        {
            string username = GetUsername(HttpContext);
            var result = await _dataService.RenameCategory(username, category, newCategoryName);
            return Ok(new DeafultMessage
            {
                success = result,
                message = $"Updated Category: {result}"
            });
        }

        [ActionName("change_priority")]
        [HttpPatch]
        public async Task<object> ChangePriority([FromQuery]string id, [FromQuery]int priority)
        {
            bool parseSuccess = ObjectId.TryParse(id, out ObjectId objectId);
            if (!parseSuccess)
                return BadRequest(new DeafultMessage
                {
                    success = false,
                    message = "Invalid id requested"
                });
            TodoItem todoItem = await _dataService.ChangePriority(objectId.ToString(), priority);
            if (todoItem == null)
                return BadRequest(new DeafultMessage
                {
                    success = false,
                    message = "Todo item does not exist"
                });
            else
                return Ok(new
                {
                    success = true,
                    message = "Todo item updated successfully",
                    todoItem
                });
        }

        [ActionName("")]
        [HttpDelete]
        public async Task<object> RemoveTodo([FromQuery]string id)
        {
            bool parseSuccess = ObjectId.TryParse(id, out ObjectId objectId);
            if (!parseSuccess)
                return BadRequest(new DeafultMessage
                {
                    success = false,
                    message = "Invalid id requested"
                });

            TodoItem todoItem = await _dataService.RemoveTodo(objectId.ToString());
            if (todoItem == null)
                return new JsonResult(new DeafultMessage
                {
                    success = false,
                    message = "Todo does not exist"
                })
                {
                    StatusCode = 404
                };
            else
                return Ok(new
                {
                    success = true,
                    message = "Todo deleted",
                    todoItem
                });
        }

        [ActionName("completed")]
        [HttpDelete]
        public async Task<object> RemoveCompleted([FromQuery]string category)
        {
            string username = GetUsername(HttpContext);
            var count = await _dataService.RemoveCompleted(username, category);
            return Ok(new DeafultMessage
            {
                success = true,
                message = $"{count} todos deleted"
            });
        }

        [ActionName("category")]
        [HttpDelete]
        public async Task<object> RemoveCategory([FromQuery]string category)
        {
            string username = GetUsername(HttpContext);
            var success = await _dataService.RemoveCategory(username, category);
            return Ok(new DeafultMessage
            {
                success = success,
                message = "Deleted"
            });
        }
    }
}