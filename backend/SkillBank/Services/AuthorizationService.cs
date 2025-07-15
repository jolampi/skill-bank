using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using SkillBank.Entities;
using SkillBank.Mappers;
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
        if (user is null || user.RefreshTokenId is null || user.RefreshTokenId != refreshTokenId)
        {
            return null;
        }
        var token = await CreateAndSaveTokenAsync(user);
        return token;
    }

    private async Task<TokenResponseDto> CreateAndSaveTokenAsync(User user)
    {
        var accessToken = CreateAccessToken(user);
        user.RefreshTokenId = Guid.CreateVersion7();
        var refreshToken = CreateRefreshToken(user);
        await context.SaveChangesAsync();
        return new TokenResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            Role = RoleMapper.ToDto(user.Role),
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
            [JwtRegisteredClaimNames.Jti] = user.RefreshTokenId!,
        };
        return CreateToken(claims, DateTime.UtcNow.AddDays(1));
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
            IssuedAt = DateTime.UtcNow,
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

    public async Task<bool> RevokeAsync(Guid userId)
    {
        var user = await context.Users.FirstOrDefaultAsync(x => x.Id == userId);
        if (user is null)
        {
            return false;
        }
        user.RefreshTokenId = null;
        await context.SaveChangesAsync();
        return true;
    }
}
