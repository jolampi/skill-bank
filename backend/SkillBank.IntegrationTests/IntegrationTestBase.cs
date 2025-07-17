using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SkillBank.Entities;

namespace SkillBank.IntegrationTests;

public abstract class IntegrationTestBase : IClassFixture<IntegrationTestApplicationFactory>
{
    protected HttpClient Client { get; }

    public IntegrationTestBase(IntegrationTestApplicationFactory factory)
    {
        Client = factory.CreateClient();

        var scope = factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        if (context.Database.GetPendingMigrations().Any())
        {
            context.Database.Migrate();
        }
    }
}
