using System.Security.Claims;
using SkillBank.Entities;

namespace SkillBank.IntegrationTests.Helpers;

public class TestClaimsProvider(List<Claim> claims)
{
    public List<Claim> Claims { get; } = claims;

    public static TestClaimsProvider WithRole(UserRole role)
    {
        List<Claim> claims = [
            new Claim(ClaimTypes.Role, role.ToString())
        ];
        return new TestClaimsProvider(claims);
    }
}
