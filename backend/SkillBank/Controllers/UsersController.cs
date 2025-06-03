using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillBank.Models;
using SkillBank.Services;

namespace SkillBank.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController(UserService userService) : ControllerBase
{
    [HttpGet("current")]
    [Authorize]
    public async Task<ActionResult<UserDto>> GetCurrent()
    {
        var userId = GetCurrentUserId();
        var user = await userService.GetByIdAsync(userId);
        if (user is null)
        {
            return BadRequest();
        }
        return Ok(user);
    }

    [HttpPut("current")]
    public async Task<ActionResult> UpdateCurrent(UpdateUserDto payload)
    {
        var userId = GetCurrentUserId();
        await userService.UpdateUserAsync(userId, payload);
        return Ok();
    }

    private Guid GetCurrentUserId()
    {
        var claim = User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier);
        return Guid.Parse(claim.Value);
    }
}
