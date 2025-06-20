namespace SkillBank.Models;

public record LoginCredentialsDto
{
    public required string Username { get; init; }
    public required string Password { get; init; }
}
