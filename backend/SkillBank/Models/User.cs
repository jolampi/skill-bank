using System.ComponentModel.DataAnnotations;

namespace SkillBank.Models;

public record CreateUserDto
{
    public required string Name { get; init; }
    public required string Username { get; init; }
    public required string Password { get; init; }
    public required RoleDto Role { get; init; }
}

public record UserListDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required string Username { get; init; }
    public required RoleDto Role { get; init; }
}

public record UserDetailsDto
{
    public required Guid Id { get; init; }
    public required string Description { get; init; }
    public required string Name { get; init; }
    public required string Username { get; init; }
    public required RoleDto Role { get; init; }
    public required List<UserSkillDto> Skills { get; init; }
};

public record UpdateUserDto
{
    public required string Description { get; set; }
    public required string Name { get; set; }
    public required List<UserSkillDto> Skills { get; init; }
}

public record UserSkillDto
{
    public required string Label { get; init; }

    public required uint ExperienceInYears { get; init; }

    public required bool Hidden { get; set; }

    /// <summary>
    /// User's proficiency in the skill, expressed as a number between 1 and 5.
    /// </summary>
    [Range(1, 5)]
    public required int Proficiency { get; init; }
}
