using System.ComponentModel.DataAnnotations;

namespace SkillBank.Entities;

public class UserSkill
{
    public required Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;

    public required Guid SkillId { get; set; }
    public virtual Skill Skill { get; set; } = null!;

    [Range(1, 5)]
    public required int Proficiency { get; set; }
}
