using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace TodoAspNetCore.Authentication
{
    public class JWTToken
    {
        public static string GenerateToken(string username, int expireDays = 7)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.UniqueName, username)
            };
            SymmetricSecurityKey key = new SymmetricSecurityKey(Convert.FromBase64String(Constants.Secret));
            SigningCredentials credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            JwtSecurityToken token = new JwtSecurityToken(
                Constants.Issuer,
                Constants.Issuer,
                claims,
                expires: DateTime.Now.AddDays(expireDays),
                signingCredentials: credentials
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public static ClaimsPrincipal GetPrincipal(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadToken(token) as JwtSecurityToken;

                if (jwtToken == null)
                    return null;

                TokenValidationParameters tokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = Constants.Issuer,
                    ValidAudience = Constants.Issuer,
                    IssuerSigningKey = new SymmetricSecurityKey(Convert.FromBase64String(Constants.Secret))
                };

                var principal = tokenHandler.ValidateToken(
                    token,
                    tokenValidationParameters,
                    out SecurityToken securityToken
                    );

                return principal;
            }
            catch (Exception error)
            {
                Console.WriteLine(error.Message);
                return null;
            }
        }
    }
}