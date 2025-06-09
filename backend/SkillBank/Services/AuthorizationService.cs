using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using SkillBank.Entities;
using SkillBank.Models;

namespace SkillBank.Services;

public class AuthorizationService(ApplicationDbContext context, IConfiguration configuration, IPasswordHasher<User> passwordhasher)
{
    public async Task<TokenResponseDto?> LoginAsync(LoginCredentialsDto credentials)
    {
        var user = await context.Users.FirstOrDefaultAsync(x => x.UserName == credentials.Username);
        if (user is null || user.PasswordHash is null)
        {
            return null;
        }
        var result = passwordhasher.VerifyHashedPassword(user, user.PasswordHash, credentials.Password);
        if (result == PasswordVerificationResult.Failed)
        {
            return null;
        }
        var token = await CreateAndSaveTokenAsync(user);
        return token;
    }

    public async Task<TokenResponseDto?> RefreshAsync(Guid userId, Guid refreshTokenId)
    {
        var user = await context.Users.FirstOrDefaultAsync(x => x.Id == userId);
        if (user is null || user.RefreshTokenIsValid(refreshTokenId, DateTime.UtcNow))
        {
            return null;
        }
        var token = await CreateAndSaveTokenAsync(user);
        return token;
    }

    private async Task<TokenResponseDto> CreateAndSaveTokenAsync(User user)
    {
        var accessToken = CreateAccessToken(user);
        user.RefreshTokenId = new Guid();
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(1);
        var refreshToken = CreateRefreshToken(user);
        await context.SaveChangesAsync();

        var role = user.Role switch
        {
            UserRole.Admin => RoleDto.Admin,
            UserRole.Consultant => RoleDto.Consultant,
            UserRole.Sales => RoleDto.Sales,
            _ => RoleDto.Consultant,
        };
        return new TokenResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            Role = role,
            TokenType = "Bearer",
        };
    }

    private string CreateAccessToken(User user)
    {
        var claims = new Dictionary<string, object>
        {
            [ClaimTypes.Name] = user.UserName ?? "",
            [ClaimTypes.NameIdentifier] = user.Id,
            [ClaimTypes.Role] = user.Role.ToString(),
        };
        return CreateToken(claims, DateTime.UtcNow.AddMinutes(10));
    }

    private string CreateRefreshToken(User user)
    {
        var claims = new Dictionary<string, object>
        {
            [ClaimTypes.NameIdentifier] = user.Id,
            [ClaimTypes.Role] = "refresh",
            ["jti"] = user.RefreshTokenId!,
        };
        return CreateToken(claims, (DateTime)user.RefreshTokenExpiryTime!);
    }

    private string CreateToken(Dictionary<string, object> claims, DateTime expires)
    {
        var authorizationToken = configuration.GetValue<string>("Authorization:Token")!;
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authorizationToken));
        var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Issuer = configuration.GetValue<string>("Authorization:Issuer"),
            Audience = configuration.GetValue<string>("Authorization:Audience"),
            Claims = claims,
            IssuedAt = null,
            NotBefore = null,
            Expires = expires,
            SigningCredentials = signingCredentials,
        };
        var handler = new JsonWebTokenHandler
        {
            SetDefaultTimesOnTokenCreation = false
        };
        return handler.CreateToken(tokenDescriptor);
    }
}
