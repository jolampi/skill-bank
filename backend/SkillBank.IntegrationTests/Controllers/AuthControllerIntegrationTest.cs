using System.Net.Http.Json;
using SkillBank.Models;
using SkillBank.Services;

namespace SkillBank.IntegrationTests.Controllers;

public class AuthControllerIntegrationTest(IntegrationTestApplicationFactory factory) : IntegrationTestBase(factory)
{
    [Fact]
    public async Task Login_ShouldAuthenticateWithCorrectCredentials()
    {
        // Arrange
        await CreateUser("admin", "admin", RoleDto.Admin);
        await Context.SaveChangesAsync();

        // Act
        CredentialsDto payload = new()
        {
            Username = "admin",
            Password = "admin",
        };
        var response = await Client.PostAsJsonAsync("/api/Auth/login", payload);

        // Assert
        response.EnsureSuccessStatusCode();
    }

    private async Task CreateUser(string userName, string password, RoleDto role)
    {
        var user = new CreateUserDto
        {
            Name = userName,
            Username = userName,
            Password = password,
            Role = role,
        };
        await GetService<UserService>().CreateAsync(user);
    }
}
