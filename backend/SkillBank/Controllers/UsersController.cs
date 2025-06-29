using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillBank.Models;
using SkillBank.Services;

namespace SkillBank.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController(UserService userService) : ControllerBase
{
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<UserDetailsDto>> Create(CreateUserDto payload)
    {
        var user = await userService.CreateAsync(payload);
        return Ok(user);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult<Unpaged<UserListDto>>> FindAll()
    {
        var users = await userService.FindAllAsync();
        return Ok(users);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDetailsDto>> GetById(Guid id)
    {
        var user = await userService.GetByIdAsync(id);
        if (user is null)
        {
            return BadRequest();
        }
        return Ok(user);
    }

    [HttpGet("current")]
    public async Task<ActionResult<UserDetailsDto>> GetCurrent()
    {
        var userId = GetCurrentUserId();
        return await GetById(userId);
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

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        bool result = await userService.DeleteAsync(id);
        if (!result)
        {
            return NotFound();
        }
        return Ok();
    }
}
