using Microsoft.EntityFrameworkCore;
using SkillBank.Entities;
using SkillBank.Models;

namespace SkillBank.Services;

public class UserService(ApplicationDbContext context)
{
    public async Task<UserDto?> GetByIdAsync(Guid id)
    {
        var user = await context.Users
            .Include(x => x.Skills)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (user is null)
        {
            return null;
        }
        var skills = user.Skills
            .Select(x => new UserSkillDto(x.Label))
            .ToList();
        var role = user.Role switch
        {
            UserRole.Admin => RoleDto.Admin,
            UserRole.Consultant => RoleDto.Consultant,
            UserRole.Sales => RoleDto.Sales,
            _ => RoleDto.Consultant,
        };
        return new UserDto
        {
            Id = user.Id,
            Username = user.UserName ?? "",
            Role = role,
            Skills = skills,
        };
    }

    public async Task UpdateUserAsync(Guid id, UpdateUserDto update)
    {
        var user = await context.Users
            .Include(x => x.Skills)
            .Include(x => x.UserSkills)
            .FirstAsync(x => x.Id == id);
        var skillsByLabel = await GetOrCreateSkillsAsync(update.Skills);

        // Remove if no longer on list
        var labels = update.Skills
            .Select(x => x.Label)
            .ToHashSet();
        foreach (var skill in user.Skills)
        {
            if (!labels.Contains(skill.Label))
            {
                var userSkill = user.UserSkills.FirstOrDefault(x => x.SkillId == skill.Id);
                if (userSkill is not null)
                {
                    context.UserSkills.Remove(userSkill);
                }
            }
        }

        // Add new entries
        foreach (var skillDto in update.Skills)
        {
            var skill = skillsByLabel[skillDto.Label];
            var userSkill = user.UserSkills.FirstOrDefault(x => x.SkillId == skill.Id);
            if (userSkill is null)
            {
                var us = new UserSkill { UserId = user.Id, SkillId = skill.Id };
                context.UserSkills.Add(us);
            }
        }

        await context.SaveChangesAsync();
    }

    private async Task<Dictionary<string, Skill>> GetOrCreateSkillsAsync(List<UserSkillDto> skills)
    {
        var labels = skills
            .Select(x => x.Label)
            .ToHashSet();
        Dictionary<string, Skill> skillsByLabel = await context.Skills
            .Where(x => labels.Contains(x.Label))
            .ToDictionaryAsync(x => x.Label);
        foreach (var label in labels)
        {
            if (!skillsByLabel.ContainsKey(label))
            {
                var skill = new Skill { Label = label };
                context.Skills.Add(skill);
                skillsByLabel.Add(label, skill);
            }
        }
        return skillsByLabel;
    }
}
