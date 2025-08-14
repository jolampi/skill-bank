using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using SkillBank.Configuration;
using SkillBank.Entities;
using SkillBank.Mappers;
using SkillBank.Models;

namespace SkillBank.Services;

public class AuthService
{
    private readonly AuthConfiguration _configuration;
    private readonly ApplicationDbContext _context;
    private readonly IPasswordHasher<User> _passwordhasher;

    public AuthService(ApplicationDbContext context, IConfiguration configuration, IPasswordHasher<User> passwordhasher)
    {
        var authConfig = configuration.GetSection("Authorization").Get<AuthConfiguration>()
            ?? throw new Exception("Missing Authorization configuration.");
        _configuration = authConfig;
        _context = context;
        _passwordhasher = passwordhasher;
    }

    public async Task<TokenDto?> LoginAsync(CredentialsDto credentials)
    {
        var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == credentials.Username);
        if (user is null || user.PasswordHash is null)
        {
            return null;
        }
        var result = _passwordhasher.VerifyHashedPassword(user, user.PasswordHash, credentials.Password);
        if (result == PasswordVerificationResult.Failed)
        {
            return null;
        }
        var token = await CreateAndSaveTokenAsync(user);
        return token;
    }

    public async Task<TokenDto?> RefreshAsync(Guid userId, Guid refreshTokenId)
    {
        var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId);
        if (user is null || user.RefreshTokenId is null || user.RefreshTokenId != refreshTokenId)
        {
            return null;
        }
        var token = await CreateAndSaveTokenAsync(user);
        return token;
    }

    private async Task<TokenDto> CreateAndSaveTokenAsync(User user)
    {
        var accessToken = CreateAccessToken(user);
        user.RefreshTokenId = Guid.CreateVersion7();
        var refreshToken = CreateRefreshToken(user);
        await _context.SaveChangesAsync();
        return new TokenDto
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
        return CreateToken(claims, DateTime.UtcNow.AddMinutes(15));
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
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.Token));
        var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Issuer = _configuration.Issuer,
            Audience = _configuration.Audience,
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
        var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId);
        if (user is null)
        {
            return false;
        }
        user.RefreshTokenId = null;
        await _context.SaveChangesAsync();
        return true;
    }
}
