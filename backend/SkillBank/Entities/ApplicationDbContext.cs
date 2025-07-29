using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace SkillBank.Entities;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<User, IdentityRole<Guid>, Guid>(options)
{
    public DbSet<Skill> Skills { get; set; }
    public DbSet<UserSkill> UserSkills { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<User>()
            .HasMany(e => e.Skills)
            .WithMany(e => e.Users)
            .UsingEntity<UserSkill>();
        builder.Entity<User>()
            .Property(e => e.Role)
            .HasConversion<string>();
        builder.Entity<User>()
            .HasIndex(e => e.UserName)
            .IsUnique();

        builder.Entity<Skill>()
            .HasIndex(e => e.Label)
            .IsUnique();
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder
            .UseSeeding((context, _) =>
            {
                var jsonPath = Path.Combine(AppContext.BaseDirectory, "seed.json");
                var content = File.ReadAllText(jsonPath);
                var serializerOptions = new JsonSerializerOptions(JsonSerializerDefaults.Web);
                serializerOptions.Converters.Add(new JsonStringEnumConverter());
                var users = JsonSerializer.Deserialize<List<SeedUser>>(content, serializerOptions)!;
                foreach (var user in users)
                {
                    EnsureUser(context, user);
                }
                context.SaveChanges();
            });

    private static User EnsureUser(DbContext context, SeedUser seedUser)
    {
        var user = context.Set<User>().FirstOrDefault(x => x.UserName == seedUser.Username);
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
            user.PasswordHash = new PasswordHasher<User>().HashPassword(user, seedUser.Password);
            context.Set<User>().Add(user);
        }
        foreach (var seedSkill in seedUser.Skills ?? [])
        {
            EnsureUserSkill(context, user, seedSkill);
        }
        return user;
    }

    private static Skill EnsureSkill(DbContext context, string label)
    {
        var skill = context.Set<Skill>().FirstOrDefault(x => x.Label == label);
        if (skill is null)
        {
            skill = new Skill { Label = label };
            context.Set<Skill>().Add(skill);
        }
        return skill;
    }

    private static UserSkill EnsureUserSkill(DbContext context, User user, SeedSkill seedSkill)
    {
        var skill = EnsureSkill(context, seedSkill.Label);
        var userSkill = context.Set<UserSkill>().FirstOrDefault(x => x.UserId == user.Id && x.SkillId == skill.Id);
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
            context.Set<UserSkill>().Add(userSkill);
        }
        return userSkill;
    }
}

record SeedUser(
    string Username,
    string Password,
    UserRole Role,
    string Name,
    List<SeedSkill> Skills,
    string Title = "",
    string Description = ""
);

record SeedSkill(string Label, int Proficiency, int ExperienceInYears);
