using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SkillBank.Entities;

namespace SkillBank.IntegrationTests.Helpers;

public abstract class IntegrationTestBase : IClassFixture<IntegrationTestApplicationFactory>
{
    private readonly IntegrationTestApplicationFactory _factory;
    private readonly IServiceScope _scope;

    protected TestDataFacade Facade { get; }
    protected JsonSerializerOptions SerializerOptions { get; }

    public IntegrationTestBase(IntegrationTestApplicationFactory factory)
    {
        _factory = factory;
        _scope = factory.Services.CreateScope();

        Facade = new TestDataFacade(GetService<ApplicationDbContext>());
        SerializerOptions = new JsonSerializerOptions(JsonSerializerDefaults.Web);
        SerializerOptions.Converters.Add(new JsonStringEnumConverter());

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
