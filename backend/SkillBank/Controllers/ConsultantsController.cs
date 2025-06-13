
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillBank.Models;
using SkillBank.Services;

namespace SkillBank.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ConsultantsController(UserService userService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<Unpaged<ConsultantListDto>>> FindAll()
    {
        var consultants = await userService.FindAllConsultantsAsync();
        return Ok(consultants);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ConsultantDetailsDto>> GetById(Guid id)
    {
        var consultant = await userService.GetConsultantByIdAsync(id);
        if (consultant is null)
        {
            return NotFound();
        }
        return Ok(id);
    }
}
