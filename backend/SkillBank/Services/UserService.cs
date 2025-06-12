using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SkillBank.Entities;
using SkillBank.Models;

namespace SkillBank.Services;

public class UserService(ApplicationDbContext context, IPasswordHasher<User> passwordHasher)
{
    public async Task<UserDetailsDto?> CreateAsync(CreateUserDto newUser)
    {
        var user = new User
        {
            UserName = newUser.Username,
            Role = RoleFromDto(newUser.Role),
        };
        user.PasswordHash = passwordHasher.HashPassword(user, newUser.Password);
        context.Set<User>().Add(user);
        await context.SaveChangesAsync();
        return new UserDetailsDto
        {
            Id = user.Id,
            Username = user.UserName,
            Role = newUser.Role,
            Skills = [],
        };
    }

    public async Task<Unpaged<UserListDto>> FindAllAsync()
    {
        var query =
            from user in context.Users
            select new UserListDto
            {
                Id = user.Id,
                Username = user.UserName ?? "",
                Role = RoleToDto(user.Role),
                Skills = user.UserSkills.Count,
            };
        var users = await query.ToListAsync();
        return new Unpaged<UserListDto>
        {
            Results = users,
        };
    }

    public async Task<UserDetailsDto?> GetByIdAsync(Guid id)
    {
        var user = await context.Users
            .Include(x => x.Skills)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (user is null)
        {
            return null;
        }
        var skills = user.Skills
            .Select(x => new UserSkillDto
            {
                Label = x.Label,
            })
            .ToList();
        return new UserDetailsDto
        {
            Id = user.Id,
            Username = user.UserName ?? "",
            Role = RoleToDto(user.Role),
            Skills = skills,
        };
    }

    private static UserRole RoleFromDto(RoleDto roleDto) => roleDto switch
    {
        RoleDto.Admin => UserRole.Admin,
        RoleDto.Consultant => UserRole.Consultant,
        RoleDto.Sales => UserRole.Sales,
        _ => UserRole.Consultant,
    };

    private static RoleDto RoleToDto(UserRole userRole) => userRole switch
    {
        UserRole.Admin => RoleDto.Admin,
        UserRole.Consultant => RoleDto.Consultant,
        UserRole.Sales => RoleDto.Sales,
        _ => RoleDto.Consultant,
    };

    public async Task UpdateUserAsync(Guid id, UpdateUserDto update)
    {
        var user = await context.Users
            .Include(x => x.Skills)
            .Include(x => x.UserSkills)
            .FirstAsync(x => x.Id == id);
        var skillsByLabel = await GetOrCreateSkillsAsync(update.Skills);
        var diff = Diff(skillsByLabel.Values, user.Skills);
        foreach (var skill in diff.Added)
        {
            var userSkill = new UserSkill { UserId = user.Id, SkillId = skill.Id };
            context.UserSkills.Add(userSkill);
        }
        foreach (var skill in diff.Removed)
        {
            var userSkill = user.UserSkills.First(x => x.SkillId == skill.Id);
            context.UserSkills.Remove(userSkill);
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

    internal static Diff Diff(IEnumerable<Skill> newSkills, IEnumerable<Skill> oldSkills)
    {
        var added = newSkills.ExceptBy(oldSkills.Select(x => x.Label), x => x.Label).ToList();
        var removed = oldSkills.ExceptBy(newSkills.Select(x => x.Label), x => x.Label).ToList();
        return new Diff(added, removed);
    }

    public async Task<bool> DeleteAsync(Guid userId)
    {
        var user = await context.Users.FirstOrDefaultAsync(x => x.Id == userId);
        if (user is null || user.Role == UserRole.Admin)
        {
            return false;
        }
        context.Users.Remove(user);
        await context.SaveChangesAsync();
        return true;
    }
}

internal record Diff(List<Skill> Added, List<Skill> Removed);
