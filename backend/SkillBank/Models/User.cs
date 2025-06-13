namespace SkillBank.Models;

public record CreateUserDto
{
    public required string Username { get; init; }
    public required string Password { get; init; }
    public required RoleDto Role { get; init; }
}

public record UserListDto
{
    public required Guid Id { get; init; }
    public required string Username { get; init; }
    public required RoleDto Role { get; init; }
}

public record UserDetailsDto
{
    public required Guid Id { get; init; }
    public required string Username { get; init; }
    public required RoleDto Role { get; init; }
    public required List<UserSkillDto> Skills { get; init; }
};

public record UpdateUserDto
{
    public required List<UserSkillDto> Skills { get; init; }
}

public record UserSkillDto
{
    public required string Label { get; init; }
}
