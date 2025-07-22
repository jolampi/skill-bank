using SkillBank.Entities;
using SkillBank.IntegrationTests.Helpers;
using System.Net;

namespace SkillBank.IntegrationTests.Controllers;

public class UsersControllerIntegrationTest(IntegrationTestApplicationFactory factory)
    : IntegrationTestBase(factory)
{
    [Fact]
    public async Task GetUsers_IsSuccessIfAdmin()
    {
        var client = CreateClient(TestClaimsProvider.WithRole(UserRole.Admin));
        var response = await client.GetAsync("/api/Users");
        response.EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task GetUsers_IsForbiddenIfConsultant()
    {
        var client = CreateClient(TestClaimsProvider.WithRole(UserRole.Consultant));
        var response = await client.GetAsync("/api/Users");
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task GetUsers_IsForbiddenIfSales()
    {
        var client = CreateClient(TestClaimsProvider.WithRole(UserRole.Sales));
        var response = await client.GetAsync("/api/Users");
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }
}
