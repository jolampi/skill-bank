using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SkillBank.Entities;

namespace SkillBank;

public class DataSeeder
{
    private readonly DbContext _context;
    private readonly PasswordHasher<User> _passwordHasher = new();
    private readonly JsonSerializerOptions _jsonSerializerOptions;

    public DataSeeder(DbContext context)
    {
        _context = context;
        _jsonSerializerOptions = new(JsonSerializerDefaults.Web);
        _jsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    }

    public void SeedData(string fileName)
    {
        var content = File.ReadAllText(fileName);
        var users = JsonSerializer.Deserialize<List<SeedUser>>(content, _jsonSerializerOptions)!;
        foreach (var user in users)
        {
            EnsureUser(user);
        }
        _context.SaveChanges();
    }

    private void EnsureUser(SeedUser seedUser)
    {
        var user = _context.Set<User>().FirstOrDefault(x => x.UserName == seedUser.Username);
        if (user is null)
        {
            user = new User
            {
                UserName = seedUser.Username,
                Role = seedUser.Role,
                Name = seedUser.Name,
                Title = seedUser.Title,
                Description = seedUser.Description,
            };
            user.PasswordHash = _passwordHasher.HashPassword(user, seedUser.Password);
            _context.Set<User>().Add(user);
        }
        foreach (var seedSkill in seedUser.Skills ?? [])
        {
            EnsureUserSkill(user, seedSkill);
        }
    }

    private void EnsureUserSkill(User user, SeedSkill seedSkill)
    {
        var skill = EnsureSkill(seedSkill.Label);
        var userSkill = _context.Set<UserSkill>().FirstOrDefault(x => x.UserId == user.Id && x.SkillId == skill.Id);
        if (userSkill is null)
        {
            userSkill = new UserSkill
            {
                UserId = user.Id,
                SkillId = skill.Id,
                Proficiency = seedSkill.Proficiency,
                ExperienceInYears = (uint)seedSkill.ExperienceInYears,
                Hidden = false,
            };
            _context.Set<UserSkill>().Add(userSkill);
        }
    }

    private Skill EnsureSkill(string label)
    {
        var skill = _context.Set<Skill>().FirstOrDefault(x => x.Label == label);
        if (skill is null)
        {
            skill = new Skill { Label = label };
            _context.Set<Skill>().Add(skill);
        }
        return skill;
    }
}

record SeedUser
{
    public required string Username { get; init; }
    public required string Password { get; init; }
    public required UserRole Role { get; init; }
    public required string Name { get; init; }
    public string Title { get; init; } = "";
    public string Description { get; init; } = "";
    public List<SeedSkill> Skills { get; init; } = [];
}

record SeedSkill
{
    public required string Label { get; init; }
    public required int Proficiency { get; init; }
    public required int ExperienceInYears { get; init; }
}

