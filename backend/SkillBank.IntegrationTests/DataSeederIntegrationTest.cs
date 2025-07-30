using Microsoft.AspNetCore.Identity;
using SkillBank.Entities;
using SkillBank.IntegrationTests.Helpers;

namespace SkillBank.IntegrationTests;

public class DataSeederIntegrationTest : IntegrationTestBase
{
    private readonly ApplicationDbContext _context;

    public DataSeederIntegrationTest(IntegrationTestApplicationFactory factory) : base(factory)
    {
        _context = GetService<ApplicationDbContext>();
    }

    [Fact]
    public void SeedData_IsValid()
    {
        // Arrange
        var seeder = new DataSeeder(_context, GetService<IPasswordHasher<User>>());

        // Act
        var seedJson = Path.Combine(AppContext.BaseDirectory, "seed.json");
        seeder.SeedData(seedJson);

        // Assert
        Assert.Equal(5, _context.Users.Count());
    }
}
