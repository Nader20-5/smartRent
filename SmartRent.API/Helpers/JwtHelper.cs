using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using SmartRent.API.Models;

namespace SmartRent.API.Helpers
{
    public class JwtHelper
    {
        private readonly IConfiguration _configuration;

        public JwtHelper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(User user)
        {
            // TODO: implement
            throw new NotImplementedException();
        }

        public ClaimsPrincipal? ValidateToken(string token)
        {
            // TODO: implement
            throw new NotImplementedException();
        }
    }
}
