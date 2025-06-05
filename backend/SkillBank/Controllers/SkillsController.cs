using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillBank.Models;
using SkillBank.Services;

namespace SkillBank.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SkillsController(SkillService skillService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<Unpaged<SkillDto>>> FindAll()
    {
        var skills = await skillService.FindAllAsync();
        return Ok(skills);
    }
}
