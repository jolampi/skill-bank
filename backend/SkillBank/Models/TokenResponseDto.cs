namespace SkillBank.Models;

public record TokenResponseDto
{
    public required string AccessToken { get; init; }
    public required string RefreshToken { get; init; }
    public required RoleDto Role { get; init; }
    public required string TokenType { get; init; }
};
