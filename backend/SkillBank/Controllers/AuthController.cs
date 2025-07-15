using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillBank.Models;
using SkillBank.Services;

namespace SkillBank.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AuthService authService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<TokenDto>> Login(CredentialsDto payload)
    {
        var token = await authService.LoginAsync(payload);
        if (token is null)
        {
            return BadRequest("Wrong username or password.");
        }
        return Ok(token);
    }

    [Authorize(Roles = "refresh")]
    [HttpPost("refresh")]
    public async Task<ActionResult<TokenDto>> Refresh()
    {
        var userIdClaim = User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier);
        var jtiClaim = User.Claims.First(c => c.Type == JwtRegisteredClaimNames.Jti);
        var token = await authService.RefreshAsync(Guid.Parse(userIdClaim.Value), Guid.Parse(jtiClaim.Value));
        if (token is null)
        {
            return BadRequest();
        }
        return Ok(token);
    }

    /// <summary>
    /// Invalidates the refresh token, effectively requiring for user to sign in again.
    /// </summary>
    [Authorize]
    [HttpPost("revoke")]
    public async Task<ActionResult> Revoke()
    {
        var userIdClaim = User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier);
        var result = await authService.RevokeAsync(Guid.Parse(userIdClaim.Value));
        if (result)
        {
            return Ok();
        }
        else
        {
            return BadRequest();
        }
    }
}
