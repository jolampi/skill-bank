using System.ComponentModel.DataAnnotations;
using SkillBank.Models;

namespace SkillBank.Entities;

public class UserSkill
{
    public required Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;

    public required Guid SkillId { get; set; }
    public virtual Skill Skill { get; set; } = null!;

    public required uint ExperienceInYears { get; set; }
    public required bool Hidden { get; set; }
    [Range(1, 5)]
    public required int Proficiency { get; set; }

    public UserSkillDto ToDto() => new()
    {
        Label = Skill.Label,
        ExperienceInYears = ExperienceInYears,
        Hidden = Hidden,
        Proficiency = Proficiency,
    };
}
