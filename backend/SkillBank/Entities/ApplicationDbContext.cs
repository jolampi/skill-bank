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
                // Test data for early development
                EnsureUser(context, "admin", "admin", UserRole.Admin);
                var consultant = EnsureUser(context, "consultant", "consultant", UserRole.Consultant);
                EnsureUser(context, "sales", "sales", UserRole.Sales);

                var dotnet = EnsureSkill(context, ".Net");
                var react = EnsureSkill(context, "React");

                EnsureUserSkill(context, consultant, dotnet);
                EnsureUserSkill(context, consultant, react);

                context.SaveChanges();
            });

    private static User EnsureUser(DbContext context, string username, string password, UserRole role)
    {
        var user = context.Set<User>().FirstOrDefault(x => x.UserName == username);
        if (user is null)
        {
            user = new User
            {
                UserName = username,
                Role = role
            };
            user.PasswordHash = new PasswordHasher<User>().HashPassword(user, password);
            context.Set<User>().Add(user);
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

    private static UserSkill EnsureUserSkill(DbContext context, User user, Skill skill)
    {
        var userSkill = context.Set<UserSkill>().FirstOrDefault(x => x.UserId == user.Id && x.SkillId == skill.Id);
        if (userSkill is null)
        {
            userSkill = new UserSkill { UserId = user.Id, SkillId = skill.Id };
            context.Set<UserSkill>().Add(userSkill);
        }
        return userSkill;
    }
}
