using Microsoft.AspNetCore.Identity;

namespace SkillBank.Entities;

public class User : IdentityUser<Guid>
{
    public required string Description { get; set; }
    public required string Name { get; set; }
    public Guid? RefreshTokenId { get; set; }
    public required UserRole Role { get; set; }

    public virtual ICollection<Skill> Skills { get; } = [];
    public virtual ICollection<UserSkill> UserSkills { get; } = [];
}
