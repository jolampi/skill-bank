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
}
