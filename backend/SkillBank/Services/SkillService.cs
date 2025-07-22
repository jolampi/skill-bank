using Microsoft.EntityFrameworkCore;
using SkillBank.Entities;
using SkillBank.Models;

namespace SkillBank.Services;

public class SkillService(ApplicationDbContext context)
{
    public async Task<Unpaged<SkillDto>> FindAllAsync()
    {
        var skills = await context.Skills
            .Select(skill => new SkillDto
            {
                Id = skill.Id,
                Label = skill.Label,
                Users = skill.UserSkills.Count,
            })
            .ToListAsync();
        return new Unpaged<SkillDto>(skills);
    }
}
