using SkillBank.Entities;

namespace SkillBank.IntegrationTests.Helpers;

public class TestDataFacade(ApplicationDbContext context)
{
    public User CreateUser(string name, UserRole role)
    {
        User user = new()
        {
            UserName = name,
            Name = name,
            Description = "",
            Role = role,
        };
        context.Users.Add(user);
        return user;
    }

    public Skill CreateSkill(string label)
    {
        var skill = new Skill
        {
            Label = label
        };
        context.Skills.Add(skill);
        return skill;
    }

    public void AddSkillForUser(User user, Skill skill, int proficiency, uint experience)
    {
        var userSkill = new UserSkill
        {
            UserId = user.Id,
            SkillId = skill.Id,
            Proficiency = proficiency,
            ExperienceInYears = experience,
            Hidden = false,
        };
        context.UserSkills.Add(userSkill);
    }

    public void AddSkillForUser(User user, string skillLabel, int proficiency, uint experience)
    {
        var skill = CreateSkill(skillLabel);
        AddSkillForUser(user, skill, proficiency, experience);
    }

    public void Save() => context.SaveChanges();
}
