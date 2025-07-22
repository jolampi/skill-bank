using System.Net.Http.Headers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SkillBank.Entities;

namespace SkillBank.IntegrationTests.Helpers;

public abstract class IntegrationTestBase : IClassFixture<IntegrationTestApplicationFactory>
{
    private readonly IntegrationTestApplicationFactory _factory;
    private readonly IServiceScope _scope;

    public IntegrationTestBase(IntegrationTestApplicationFactory factory)
    {
        _factory = factory;
        _scope = factory.Services.CreateScope();
        HandleMigrations();
    }

    private void HandleMigrations()
    {
        var context = GetService<ApplicationDbContext>();
        if (context.Database.GetPendingMigrations().Any())
        {
            context.Database.Migrate();
        }
        // TODO: Figure out how to disable seeding
        context.UserSkills.ExecuteDelete();
        context.Skills.ExecuteDelete();
        context.Users.ExecuteDelete();
    }

    public HttpClient CreateClient() => _factory.CreateClient();

    public HttpClient CreateClient(TestClaimsProvider testClaimsProvider)
    {
        var client = _factory.ConfigureAuth(testClaimsProvider).CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Test");
        return client;
    }

    public T GetService<T>()
        where T : notnull
    {
        return _scope.ServiceProvider.GetRequiredService<T>();
    }
}
