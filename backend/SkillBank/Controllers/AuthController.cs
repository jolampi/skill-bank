using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillBank.Models;
using SkillBank.Services;

namespace SkillBank.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController(AuthorizationService authorizationService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<TokenResponseDto>> Login(LoginCredentialsDto payload)
    {
        var token = await authorizationService.LoginAsync(payload);
        if (token is null)
        {
            return BadRequest("Wrong username or password.");
        }
        return Ok(token);
    }

    [Authorize(Roles = "refresh")]
    [HttpPost("refresh")]
    public async Task<ActionResult<TokenResponseDto>> Refresh()
    {
        var userIdClaim = User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier);
        var jtiClaim = User.Claims.First(c => c.Type == "jti");
        var token = await authorizationService.RefreshAsync(Guid.Parse(userIdClaim.Value), Guid.Parse(jtiClaim.Value));
        if (token is null)
        {
            return BadRequest();
        }
        return Ok(token);
    }
}
