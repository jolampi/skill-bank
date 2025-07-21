using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SkillBank.Entities;

namespace SkillBank.IntegrationTests;

public abstract class IntegrationTestBase : IClassFixture<IntegrationTestApplicationFactory>
{
    protected ApplicationDbContext Context { get; }
    protected HttpClient Client { get; }

    private readonly IServiceScope _scope;

    public IntegrationTestBase(IntegrationTestApplicationFactory factory)
    {
        Client = factory.CreateClient();

        _scope = factory.Services.CreateScope();
        Context = _scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        if (Context.Database.GetPendingMigrations().Any())
        {
            Context.Database.Migrate();
        }
        // TODO: Figure out how to disable seeding
        Context.UserSkills.ExecuteDelete();
        Context.Skills.ExecuteDelete();
        Context.Users.ExecuteDelete();
    }

    public T GetService<T>()
        where T : notnull
    {
        return _scope.ServiceProvider.GetRequiredService<T>();
    }
}
