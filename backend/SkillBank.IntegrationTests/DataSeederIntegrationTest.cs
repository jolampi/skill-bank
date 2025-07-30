using Microsoft.AspNetCore.Identity;
using SkillBank.Entities;
using SkillBank.IntegrationTests.Helpers;
using SkillBank.Models;
using SkillBank.Services;

namespace SkillBank.IntegrationTests;

public class DataSeederIntegrationTest : IntegrationTestBase
{
    private readonly ApplicationDbContext _context;
    private readonly DataSeeder _dataSeeder;

    public DataSeederIntegrationTest(IntegrationTestApplicationFactory factory) : base(factory)
    {
        _context = GetService<ApplicationDbContext>();
        _dataSeeder = new DataSeeder(_context, GetService<IPasswordHasher<User>>());
    }

    [Fact]
    public void SeedData_SeedsAdmin()
    {
        // Arrange
        var authService = GetService<AuthService>();

        // Act
        _dataSeeder.SeedAdmin("admin1");

        // Assert
        var credentials = new CredentialsDto()
        {
            Username = "admin",
            Password = "admin1"
        };
        Assert.NotNull(authService.LoginAsync(credentials));
    }

    [Fact]
    public async Task SeedDataAsync_SeedsAdmin()
    {
        // Arrange
        var authService = GetService<AuthService>();

        // Act
        await _dataSeeder.SeedAdminAsync("admin1", CancellationToken.None);

        // Assert
        var credentials = new CredentialsDto()
        {
            Username = "admin",
            Password = "admin1"
        };
        Assert.NotNull(await authService.LoginAsync(credentials));
    }

    [Fact]
    public void SeedData_IsValid()
    {
        // Act
        var seedJson = Path.Combine(AppContext.BaseDirectory, "seed.json");
        _dataSeeder.SeedData(seedJson);

        // Assert
        Assert.Equal(4, _context.Users.Count());
    }
}
