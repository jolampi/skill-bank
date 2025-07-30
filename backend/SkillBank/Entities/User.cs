using Microsoft.AspNetCore.Identity;
using SkillBank.Mappers;
using SkillBank.Models;

namespace SkillBank.Entities;

public class User : IdentityUser<Guid>
{
    public Guid? RefreshTokenId { get; set; }
    public required UserRole Role { get; set; }

    public required string Name { get; set; }
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";

    public virtual ICollection<Skill> Skills { get; } = [];
    public virtual ICollection<UserSkill> UserSkills { get; } = [];

    public UserDetailsDto ToDto() => new()
    {
        Id = Id,
        Username = UserName ?? "",
        Name = Name,
        Description = Description,
        Title = Title,
        Role = RoleMapper.ToDto(Role),
        Skills = [.. UserSkills.Select(x => x.ToDto())],
    };
}
