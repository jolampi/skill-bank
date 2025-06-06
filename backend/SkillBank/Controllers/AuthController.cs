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

    [HttpPost("refresh")]
    public async Task<ActionResult<TokenResponseDto>> Refresh(RefreshTokenDto payload)
    {
        var token = await authorizationService.RefreshAsync(payload);
        if (token is null)
        {
            return Forbid();
        }
        return Ok(token);
    }
}
