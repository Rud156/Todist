using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Linq;
using System.Security.Claims;
using TodoAspNetCore.Models;

namespace TodoAspNetCore.Authentication
{
    public class TokenActionFilter : Attribute, IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        {
            IHeaderDictionary request = context.HttpContext.Request.Headers;
            string authHeader = request["Authorization"].ToString();
            string token = authHeader.Replace("Bearer ", "");

            bool tokenValid = ValidateToken(token, out string username);
            context.HttpContext.Items.Add("username", username);

            if (!tokenValid)
            {
                JsonResult jsonResult = new JsonResult(new DeafultMessage
                {
                    success = false,
                    message = "Request recieved with invalid token."
                })
                {
                    StatusCode = 401
                };
                context.Result = jsonResult;
            }
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            // Do nothing
        }

        private static bool ValidateToken(string token, out string username)
        {
            username = null;

            var simplePrinciple = JWTToken.GetPrincipal(token);
            var identity = simplePrinciple?.Identity as ClaimsIdentity;

            if (identity == null)
                return false;

            if (!identity.IsAuthenticated)
                return false;

            if (!identity.HasClaim(_ => _.Type == ClaimTypes.Name))
                return false;

            Claim usernameClaim = identity.Claims.FirstOrDefault(_ => _.Type == ClaimTypes.Name);
            username = usernameClaim.Value;

            if (string.IsNullOrEmpty(username))
                return false;

            return true;
        }
    }
}