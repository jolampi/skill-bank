using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace SkillBank.Entities;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<User>(options)
{
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder
            .UseSeeding((context, _) =>
            {
                // Test users for early development
                EnsureUser(context, "admin", "admin");
                EnsureUser(context, "developer", "developer");
                EnsureUser(context, "sales", "sales");
                context.SaveChanges();
            });

    private static User EnsureUser(DbContext context, string username, string password)
    {
        var user = context.Set<User>().FirstOrDefault(x => x.UserName == username);
        if (user is null)
        {
            user = new User { UserName = username };
            user.PasswordHash = new PasswordHasher<User>().HashPassword(user, password);
            context.Set<User>().Add(user);
        }
        return user;
    }
}
