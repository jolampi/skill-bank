using SkillBank.Entities;
using SkillBank.Models;
using SkillBank.Services;

namespace SkillBank.IntegrationTests.Services;

public class UserServiceIntegrationTest : IntegrationTestBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserService _userService;

    public UserServiceIntegrationTest(IntegrationTestApplicationFactory factory) : base(factory)
    {
        _context = GetService<ApplicationDbContext>();
        _userService = GetService<UserService>();
    }

    [Fact]
    public async Task FindConsultantsAsync_FindsConsultantsWithMinimumExperience()
    {
        // Arrange
        var user = await CreateConsultant("React Guy");
        var react = await CreateSkill("React");
        await AddSkillForUser(user, react, 1, 5);
        await _context.SaveChangesAsync();

        // Act
        ConsultantSearchParamsDto matchingParams = new()
        {
            Skills = [CreateExperienceFilter("React", 4)]
        };
        var oneResult = (await _userService.FindConsultantsAsync(matchingParams)).Results;

        ConsultantSearchParamsDto missingParams = new()
        {
            Skills = [CreateExperienceFilter("React", 8)]
        };
        var noResults = (await _userService.FindConsultantsAsync(missingParams)).Results;

        // Assert
        Assert.Single(oneResult);
        Assert.Equal("React Guy", oneResult.First().Name);
        Assert.Empty(noResults);
    }

    [Fact]
    public async Task FindConsultantsAsync_FindsConsultantWithMinimumProficiency()
    {
        // Arrange
        var user = await CreateConsultant("React Guy");
        var react = await CreateSkill("React");
        await AddSkillForUser(user, react, 3, 0);
        await _context.SaveChangesAsync();

        // Act
        ConsultantSearchParamsDto matchingParams = new()
        {
            Skills = [CreateProficiencyFilter("React", 3)]
        };
        var oneResult = (await _userService.FindConsultantsAsync(matchingParams)).Results;

        ConsultantSearchParamsDto missingParams = new()
        {
            Skills = [CreateProficiencyFilter("React", 8)]
        };
        var noResults = (await _userService.FindConsultantsAsync(missingParams)).Results;

        // Assert
        Assert.Single(oneResult);
        Assert.Equal("React Guy", oneResult.First().Name);
        Assert.Empty(noResults);
    }

    [Fact]
    public async Task FindConsultantsAsync_FindsConsultantWithMultipleFilters()
    {
        // Arrange
        var user = await CreateConsultant("React Guy");
        await AddSkillForUser(user, await CreateSkill("React"), 3, 0);
        await AddSkillForUser(user, await CreateSkill("JavaScript"), 1, 5);
        await _context.SaveChangesAsync();

        // Act
        ConsultantSearchParamsDto matchingParams = new()
        {
            Skills = [
                CreateProficiencyFilter("React", 3),
                CreateExperienceFilter("JavaScript", 5),
            ],
        };
        var oneResult = (await _userService.FindConsultantsAsync(matchingParams)).Results;

        ConsultantSearchParamsDto missingParams = new()
        {
            Skills = [
                CreateProficiencyFilter("React", 8),
                CreateExperienceFilter("JavaScript", 10)
            ]
        };
        var noResults = (await _userService.FindConsultantsAsync(missingParams)).Results;

        // Assert
        Assert.Single(oneResult);
        Assert.Equal("React Guy", oneResult.First().Name);
        Assert.Empty(noResults);
    }

    private async Task<User> CreateConsultant(string name)
    {
        User user = new()
        {
            UserName = name,
            Name = name,
            Description = "",
            Role = UserRole.Consultant,
        };
        await _context.Users.AddAsync(user);
        return user;
    }

    private async Task<Skill> CreateSkill(string label)
    {
        var skill = new Skill { Label = label };
        await _context.Skills.AddAsync(skill);
        return skill;
    }

    private async Task AddSkillForUser(User user, Skill skill, int proficiency, uint experience)
    {
        var userSkill = new UserSkill
        {
            UserId = user.Id,
            SkillId = skill.Id,
            Proficiency = proficiency,
            ExperienceInYears = experience,
            Hidden = false,
        };
        await _context.UserSkills.AddAsync(userSkill);
    }

    private static UserSkillFilterDto CreateExperienceFilter(string label, int experience) => new()
    {
        Label = label,
        MinimumExperience = experience,
    };

    private static UserSkillFilterDto CreateProficiencyFilter(string label, int proficiency) => new()
    {
        Label = label,
        MinimumProficiency = proficiency,
    };
}
