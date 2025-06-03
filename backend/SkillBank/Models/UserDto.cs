namespace SkillBank.Models;

public record UserDto(
    Guid Id,
    string Username,
    List<UserSkillDto> Skills
);
