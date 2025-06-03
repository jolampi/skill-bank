using Microsoft.AspNetCore.Identity;

namespace SkillBank.Entities;

public class User : IdentityUser<Guid>
{
    public virtual ICollection<Skill> Skills { get; } = [];
    public virtual ICollection<UserSkill> UserSkills { get; } = [];
}
