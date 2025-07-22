using System.Net.Http.Json;
using SkillBank.Entities;
using SkillBank.IntegrationTests.Helpers;
using SkillBank.Models;

namespace SkillBank.IntegrationTests.Controllers;

public class ConsultantsControllerIntegrationTest(IntegrationTestApplicationFactory factory)
    : IntegrationTestBase(factory)
{
    [Fact]
    public async Task FindConsultants_ShouldFilterResults()
    {
        // Arrange
        var consultantA = Facade.CreateUser("Amy A", UserRole.Consultant);
        var consultantB = Facade.CreateUser("Ben B", UserRole.Consultant);
        var consultantC = Facade.CreateUser("Carlos C", UserRole.Consultant);

        var dotnet = Facade.CreateSkill(".NET");
        Facade.AddSkillForUser(consultantA, dotnet, 1, 3);
        Facade.AddSkillForUser(consultantB, dotnet, 2, 3);
        Facade.AddSkillForUser(consultantC, dotnet, 3, 3);

        var aspnet = Facade.CreateSkill("ASP.NET");
        Facade.AddSkillForUser(consultantA, aspnet, 3, 3);
        Facade.AddSkillForUser(consultantB, aspnet, 3, 2);
        Facade.AddSkillForUser(consultantC, aspnet, 3, 1);

        var user = Facade.CreateUser("User", UserRole.Sales);
        Facade.Save();

        var client = CreateClient(TestClaimsProvider.ForUser(user));

        // Act
        var filter1 = new UserSkillFilterDto()
        {
            Label = ".NET",
            MinimumProficiency = 2,
            MinimumExperience = 0
        };
        var filter2 = new UserSkillFilterDto()
        {
            Label = "ASP.NET",
            MinimumProficiency = 0,
            MinimumExperience = 2,
        };
        var response1 = await DoConsultantSearch(client, []);
        var response2 = await DoConsultantSearch(client, [filter1]);
        var response3 = await DoConsultantSearch(client, [filter2]);
        var response4 = await DoConsultantSearch(client, [filter1, filter2]);

        // Assert
        Assert.Equal(3, response1.Count);
        Assert.Equal(2, response2.Count);
        Assert.Equal(2, response3.Count);
        Assert.Equal("Ben B", response4.Single().Name);
    }

    private static async Task<List<ConsultantListDto>> DoConsultantSearch(
        HttpClient client,
        List<UserSkillFilterDto> searchParams)
    {
        var payload = new ConsultantSearchParamsDto(searchParams);
        var response = await client.PostAsJsonAsync("/api/Consultants", payload);
        var body = await response.Content.ReadFromJsonAsync<Unpaged<ConsultantListDto>>();
        return [.. body!.Results];
    }
}
