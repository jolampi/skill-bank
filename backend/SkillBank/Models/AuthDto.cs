namespace SkillBank.Models;

public record RefreshTokenDto
{
    public required string RefreshToken { get; init; }
    public required string Username { get; set; }
}
