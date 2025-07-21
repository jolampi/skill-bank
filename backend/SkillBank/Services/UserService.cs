using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SkillBank.Entities;
using SkillBank.Mappers;
using SkillBank.Models;

namespace SkillBank.Services;

public class UserService(ApplicationDbContext context, IPasswordHasher<User> passwordHasher)
{
    public async Task<UserDetailsDto?> CreateAsync(CreateUserDto newUser)
    {
        var user = new User
        {
            Description = "",
            Name = newUser.Name,
            UserName = newUser.Username,
            Role = RoleMapper.FromDto(newUser.Role),
        };
        user.PasswordHash = passwordHasher.HashPassword(user, newUser.Password);
        context.Set<User>().Add(user);
        await context.SaveChangesAsync();
        return new UserDetailsDto
        {
            Id = user.Id,
            Description = user.Description,
            Name = user.Name,
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
                Name = user.Name,
                Username = user.UserName ?? "",
                Role = RoleMapper.ToDto(user.Role),
            };
        var users = await query.ToListAsync();
        return new Unpaged<UserListDto>
        {
            Results = users,
        };
    }

    public async Task<Unpaged<ConsultantListDto>> FindAllConsultantsAsync()
    {
        var query =
            from user in context.Users
            where user.Role == UserRole.Consultant
            select new ConsultantListDto
            {
                Id = user.Id,
                Name = user.Name,
                Skills = user.UserSkills.Count,
            };
        var users = await query.ToListAsync();
        return new Unpaged<ConsultantListDto>
        {
            Results = users,
        };
    }

    public async Task<Unpaged<ConsultantListDto>> FindConsultantsAsync(ConsultantSearchParamsDto searchParams)
    {
        var query = context.Users
            .Where(user => user.Role == UserRole.Consultant)
            .AsQueryable();
        foreach (var skill in searchParams.Skills)
        {
            query = query.Where(user => user.UserSkills.Any(x =>
                x.Skill.Label == skill.Label
                    && x.Proficiency >= skill.MinimumProficiency
                    && x.ExperienceInYears >= skill.MinimumExperience
            ));
        }
        var results = await query.Select(x => new ConsultantListDto()
        {
            Id = x.Id,
            Name = x.Name,
            Skills = x.UserSkills.Count
        }).ToListAsync();
        return new Unpaged<ConsultantListDto>
        {
            Results = results,
        };
    }

    public async Task<UserDetailsDto?> GetByIdAsync(Guid id)
    {
        User? user = await context.Users
            .Include(x => x.UserSkills)
            .ThenInclude(x => x.Skill)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (user is null)
        {
            return null;
        }
        var skills = user.UserSkills.Select(x => x.ToDto()).ToList();
        return new UserDetailsDto
        {
            Id = user.Id,
            Description = user.Description,
            Name = user.Name,
            Username = user.UserName ?? "",
            Role = RoleMapper.ToDto(user.Role),
            Skills = skills,
        };
    }

    public async Task<ConsultantDetailsDto?> GetConsultantByIdAsync(Guid id)
    {
        var user = await context.Users
            .Include(x => x.UserSkills)
            .ThenInclude(x => x.Skill)
            .FirstOrDefaultAsync(x => x.Id == id && x.Role == UserRole.Consultant);
        if (user is null)
        {
            return null;
        }
        var skills = user.UserSkills.Select(x => x.ToDto()).ToList();
        return new ConsultantDetailsDto
        {
            Id = user.Id,
            Name = user.Name,
            Skills = skills,
        };
    }

    public async Task UpdateUserAsync(Guid id, UpdateUserDto update)
    {
        var user = await context.Users
            .Include(x => x.Skills)
            .Include(x => x.UserSkills)
            .FirstAsync(x => x.Id == id);
        user.Description = update.Description;
        user.Name = update.Name;

        var skills = await GetOrCreateSkillsAsync(update.Skills);
        var skillUpdatesByLabel = update.Skills.ToDictionary(x => x.Label);
        var diff = Diff(skills, user.Skills);
        foreach (var skill in diff.Added)
        {
            var added = skillUpdatesByLabel[skill.Label];
            var userSkill = new UserSkill
            {
                UserId = user.Id,
                SkillId = skill.Id,
                ExperienceInYears = added.ExperienceInYears,
                Hidden = added.Hidden,
                Proficiency = added.Proficiency,
            };
            context.UserSkills.Add(userSkill);
        }
        foreach (var skill in diff.Changed)
        {
            var userSkill = user.UserSkills.First(x => x.SkillId == skill.Id);
            var updated = skillUpdatesByLabel[skill.Label];
            userSkill.ExperienceInYears = updated.ExperienceInYears;
            userSkill.Hidden = updated.Hidden;
            userSkill.Proficiency = updated.Proficiency;
        }
        foreach (var skill in diff.Removed)
        {
            var userSkill = user.UserSkills.First(x => x.SkillId == skill.Id);
            context.UserSkills.Remove(userSkill);
        }

        await context.SaveChangesAsync();
    }

    private async Task<List<Skill>> GetOrCreateSkillsAsync(List<UserSkillDto> skills)
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
        return [.. skillsByLabel.Values];
    }

    internal static Diff Diff(IEnumerable<Skill> newSkills, IEnumerable<Skill> oldSkills)
    {
        HashSet<string> oldSet = [.. oldSkills.Select(x => x.Label)];
        List<Skill> added = [];
        List<Skill> changed = [];
        foreach (var skill in newSkills)
        {
            var list = oldSet.Contains(skill.Label) ? changed : added;
            list.Add(skill);
        }
        var removed = oldSkills.ExceptBy(newSkills.Select(x => x.Label), x => x.Label).ToList();
        return new Diff(added, changed, removed);
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

internal record Diff(List<Skill> Added, List<Skill> Changed, List<Skill> Removed);
