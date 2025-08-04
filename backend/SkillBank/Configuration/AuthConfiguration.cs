namespace SkillBank.Configuration;

public record AuthConfiguration
{
    public required string Token { get; init; }
    public required string Issuer { get; init; }
    public required string Audience { get; init; }
}
