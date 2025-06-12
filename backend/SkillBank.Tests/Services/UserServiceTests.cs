using SkillBank.Entities;
using SkillBank.Services;

namespace SkillBank.Tests.Services;

public class UserServiceTests
{
    private static readonly Skill CSHARP = new() { Label = "C#" };
    private static readonly Skill REACT = new() { Label = "React" };
    private static readonly Skill TYPESCRIPT = new() { Label = "TypeScript" };

    [Fact]
    public void DiffHandlesIdentity()
    {
        CheckDiff([], [], new Diff([], []));
    }

    [Fact]
    public void DiffHandlesChangedOrder()
    {
        CheckDiff([CSHARP, REACT], [REACT, CSHARP], new Diff([], []));
    }

    [Fact]
    public void DiffHandlesAdditions()
    {
        List<Skill> newSkills = [CSHARP, REACT, TYPESCRIPT];
        List<Skill> oldSkills = [CSHARP, REACT];
        CheckDiff(newSkills, oldSkills, new Diff([TYPESCRIPT], []));
    }

    [Fact]
    public void DiffHandlesRemovals()
    {
        List<Skill> newSkills = [CSHARP];
        List<Skill> oldSkills = [CSHARP, REACT, TYPESCRIPT];
        CheckDiff(newSkills, oldSkills, new Diff([], [REACT, TYPESCRIPT]));
    }

    [Fact]
    public void HandlesMix()
    {
        List<Skill> newSkills = [CSHARP, REACT];
        List<Skill> oldSkills = [TYPESCRIPT, CSHARP];
        CheckDiff(newSkills, oldSkills, new Diff([REACT], [TYPESCRIPT]));
    }

    private static void CheckDiff(List<Skill> newSkills, List<Skill> oldSkills, Diff expectedDiff)
    {
        var result = UserService.Diff(newSkills, oldSkills);
        Assert.Equal(expectedDiff.Removed, result.Removed);
        Assert.Equal(expectedDiff.Added, result.Added);
    }
}
