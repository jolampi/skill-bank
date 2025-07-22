using System.Security.Claims;
using SkillBank.Entities;

namespace SkillBank.IntegrationTests.Helpers;

public class TestClaimsProvider(List<Claim> claims)
{
    public List<Claim> Claims { get; } = claims;

    public static TestClaimsProvider ForUser(User user)
    {
        List<Claim> claims = [
            new Claim(ClaimTypes.Name, user.Name.ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        ];
        return new TestClaimsProvider(claims);
    }
}
