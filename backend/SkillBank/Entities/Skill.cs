namespace SkillBank.Entities;

public class Skill
{
    public Guid Id { get; set; }
    public required string Label { get; set; }

    public virtual ICollection<User> Users { get; } = [];
    public virtual ICollection<UserSkill> UserSkills { get; } = [];
}
