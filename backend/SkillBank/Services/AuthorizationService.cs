using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using SkillBank.Models;

namespace SkillBank.Services;

public class AuthorizationService(ApplicationDbContext context, IConfiguration configuration, IPasswordHasher<User> passwordhasher)
{
    public async Task<string?> Login(LoginCredentialsDto credentials)
    {
        var user = await context.Users.FirstOrDefaultAsync(x => x.UserName == credentials.UserName);
        if (user is null || user.PasswordHash is null)
        {
            return null;
        }
        var result = passwordhasher.VerifyHashedPassword(user, user.PasswordHash, credentials.Password);
        if (result == PasswordVerificationResult.Failed)
        {
            return null;
        }
        return CreateToken(user);
    }

    private string CreateToken(User user)
    {
        var claims = new Dictionary<string, object>
        {
            [ClaimTypes.Name] = user.UserName ?? "",
            [ClaimTypes.NameIdentifier] = user.Id,
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetValue<string>("Authorization:Token")!));
        var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Issuer = configuration.GetValue<string>("Authorization:Issuer"),
            Audience = configuration.GetValue<string>("Authorization:Audience"),
            Claims = claims,
            IssuedAt = null,
            NotBefore = null,
            Expires = DateTime.UtcNow.AddDays(1),
            SigningCredentials = signingCredentials,
        };
        var handler = new JsonWebTokenHandler
        {
            SetDefaultTimesOnTokenCreation = false
        };
        return handler.CreateToken(tokenDescriptor);
    }
}
