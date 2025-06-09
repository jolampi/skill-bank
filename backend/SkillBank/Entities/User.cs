using Microsoft.AspNetCore.Identity;

namespace SkillBank.Entities;

public class User : IdentityUser<Guid>
{
    public DateTime? RefreshTokenExpiryTime { get; set; }
    public Guid? RefreshTokenId { get; set; }
    public required UserRole Role { get; set; }

    public virtual ICollection<Skill> Skills { get; } = [];
    public virtual ICollection<UserSkill> UserSkills { get; } = [];

    public bool RefreshTokenIsValid(Guid refreshTokenId, DateTime timestamp)
    {
        return RefreshTokenId is not null
            && RefreshTokenExpiryTime is not null
            && RefreshTokenExpiryTime <= timestamp
            && refreshTokenId == RefreshTokenId;
    }
}
