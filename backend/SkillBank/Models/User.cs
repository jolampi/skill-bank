namespace SkillBank.Models;

public record UserDto
{
    public required Guid Id { get; init; }
    public required string Username { get; init; }
    public required RoleDto Role { get; init; }
    public required List<UserSkillDto> Skills { get; init; }
};

public record UpdateUserDto(List<UserSkillDto> Skills);

public record UserSkillDto(string Label);
