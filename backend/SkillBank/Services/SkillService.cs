using Microsoft.EntityFrameworkCore;
using SkillBank.Entities;
using SkillBank.Models;

namespace SkillBank.Services;

public class SkillService(ApplicationDbContext context)
{
    public async Task<Unpaged<SkillDto>> FindAllAsync()
    {
        var query =
            from skill in context.Skills
            select new SkillDto
            {
                Id = skill.Id,
                Label = skill.Label,
                Developers = skill.UserSkills.Count
            };
        var skills = await query.ToListAsync();
        return new Unpaged<SkillDto>(skills);
    }
}
