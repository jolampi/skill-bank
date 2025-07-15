namespace SkillBank.Models;

public record CredentialsDto
{
    public required string Username { get; init; }
    public required string Password { get; init; }
}

public record TokenDto
{
    public required string AccessToken { get; init; }
    public required string RefreshToken { get; init; }
    public required RoleDto Role { get; init; }
    public required string TokenType { get; init; }
};
