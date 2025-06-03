namespace SkillBank.Models;

public record UserDto(
    Guid Id,
    string Username,
    List<UserSkillDto> Skills
);

public record UpdateUserDto(List<UserSkillDto> Skills);
