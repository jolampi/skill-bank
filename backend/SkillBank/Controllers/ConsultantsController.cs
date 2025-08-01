
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
    [HttpPost]
    public async Task<ActionResult<Unpaged<ConsultantDto>>> Find(ConsultantSearchParamsDto payload)
    {
        var consultants = await userService.FindConsultantsAsync(payload);
        return Ok(consultants);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ConsultantDto>> GetById(Guid id)
    {
        var consultant = await userService.GetConsultantByIdAsync(id);
        if (consultant is null)
        {
            return NotFound();
        }
        return Ok(id);
    }
}
