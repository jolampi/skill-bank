using System.Net.Http.Json;
using SkillBank.Models;

namespace SkillBank.IntegrationTests.Controllers;

public class AuthControllerIntegrationTest(IntegrationTestApplicationFactory factory) : IntegrationTestBase(factory)
{
    [Fact]
    public async Task Login_ShouldAuthenticateWithCorrectCredentials()
    {
        // Arrange

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
}
