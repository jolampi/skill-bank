using SkillBank.Entities;
using SkillBank.IntegrationTests.Helpers;
using SkillBank.Models;
using System.Net;
using System.Net.Http.Json;

namespace SkillBank.IntegrationTests.Controllers;

public class UsersControllerIntegrationTest(IntegrationTestApplicationFactory factory)
    : IntegrationTestBase(factory)
{
    [Theory]
    [InlineData(UserRole.Admin, HttpStatusCode.OK)]
    [InlineData(UserRole.Consultant, HttpStatusCode.Forbidden)]
    [InlineData(UserRole.Sales, HttpStatusCode.Forbidden)]
    public async Task GetUsers_IsProtected(UserRole role, HttpStatusCode expectedStatusCode)
    {
        // Arrange
        var user = Facade.CreateUser("User", role);
        Facade.Save();

        var client = CreateClient(TestClaimsProvider.ForUser(user));

        // Act
        var response = await client.GetAsync("/api/Users");

        // Assert
        Assert.Equal(expectedStatusCode, response.StatusCode);
    }

    [Fact]
    public async Task UpdateCurrent_UpdatesUserSkills()
    {
        // Arrange
        var user = Facade.CreateUser("John Doe", UserRole.Consultant);
        Facade.AddSkillForUser(user, "C#", 1, 0);
        var dotnet1 = CreateSkillDto(".NET", 1, 0);
        Facade.AddSkillForUser(user, dotnet1.Label, dotnet1.Proficiency, dotnet1.ExperienceInYears);
        Facade.Save();

        var client = CreateClient(TestClaimsProvider.ForUser(user));

        // Check initial state
        var initialResponse = await client.GetFromJsonAsync<UserDetailsDto>("/api/Users/current", SerializerOptions);
        Assert.Equal(2, initialResponse?.Skills.Count);
        Assert.Equal(dotnet1, initialResponse?.Skills.Find(x => x.Label == ".NET"));

        // Act
        UserSkillDto dotnet2 = CreateSkillDto(".NET", 3, 1);
        UserSkillDto aspnet = CreateSkillDto("ASP.NET", 2, 1);
        var payload = new UpdateUserDto()
        {
            Name = "John Doe",
            Title = "Backend Developer",
            Description = "",
            Skills = [
                dotnet2,
                aspnet,
            ],
        };
        await client.PutAsJsonAsync("/api/Users/current", payload);

        // Assert
        var newResponse = await client.GetFromJsonAsync<UserDetailsDto>("/api/Users/current", SerializerOptions);
        Assert.Equal(2, newResponse?.Skills.Count);
        Assert.Equal(dotnet2, newResponse?.Skills.Find(x => x.Label == ".NET"));
        Assert.Equal(aspnet, newResponse?.Skills.Find(x => x.Label == "ASP.NET"));
    }

    private static UserSkillDto CreateSkillDto(string label, int proficiency, uint experience)
    {
        return new UserSkillDto
        {
            Label = label,
            Proficiency = proficiency,
            ExperienceInYears = experience,
            Hidden = false,
        };
    }
}
