using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillBank.Services;

namespace SkillBank.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController(UserService userService) : ControllerBase
{
    [HttpGet("current")]
    [Authorize]
    public async Task<ActionResult> GetCurrent()
    {
        var currentUserId = User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value;
        var user = await userService.GetByIdAsync(currentUserId);
        if (user is null)
        {
            return BadRequest();
        }
        return Ok(user);
    }
}
