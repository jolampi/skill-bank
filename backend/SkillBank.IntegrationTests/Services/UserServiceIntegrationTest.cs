using SkillBank.Entities;
using SkillBank.IntegrationTests.Helpers;
using SkillBank.Models;
using SkillBank.Services;

namespace SkillBank.IntegrationTests.Services;

public class UserServiceIntegrationTest : IntegrationTestBase
{
    private readonly UserService _userService;

    public UserServiceIntegrationTest(IntegrationTestApplicationFactory factory) : base(factory)
    {
        _userService = GetService<UserService>();
    }

    [Fact]
    public async Task FindConsultantsAsync_FindsConsultantsWithMinimumExperience()
    {
        // Arrange
        var user = Facade.CreateUser("React Guy", UserRole.Consultant);
        Facade.AddSkillForUser(user, "React", 1, 5);
        Facade.Save();

        // Act
        ConsultantSearchParamsDto matchingParams = new([
            CreateExperienceFilter("React", 4),
        ]);
        var oneResult = (await _userService.FindConsultantsAsync(matchingParams)).Results;

        ConsultantSearchParamsDto missingParams = new([
            CreateExperienceFilter("React", 8),
        ]);
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
        var user = Facade.CreateUser("React Guy", UserRole.Consultant);
        Facade.AddSkillForUser(user, "React", 3, 0);
        Facade.Save();

        // Act
        ConsultantSearchParamsDto matchingParams = new([
            CreateProficiencyFilter("React", 3),
        ]);
        var oneResult = (await _userService.FindConsultantsAsync(matchingParams)).Results;

        ConsultantSearchParamsDto missingParams = new([
            CreateProficiencyFilter("React", 8),
        ]);
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
        var user = Facade.CreateUser("React Guy", UserRole.Consultant);
        Facade.AddSkillForUser(user, "React", 3, 0);
        Facade.AddSkillForUser(user, "JavaScript", 1, 5);
        Facade.Save();

        // Act
        ConsultantSearchParamsDto matchingParams = new([
            CreateProficiencyFilter("React", 3),
            CreateExperienceFilter("JavaScript", 5),
        ]);
        var oneResult = (await _userService.FindConsultantsAsync(matchingParams)).Results;

        ConsultantSearchParamsDto missingParams = new([
            CreateProficiencyFilter("React", 8),
            CreateExperienceFilter("JavaScript", 10),
        ]);
        var noResults = (await _userService.FindConsultantsAsync(missingParams)).Results;

        // Assert
        Assert.Single(oneResult);
        Assert.Equal("React Guy", oneResult.First().Name);
        Assert.Empty(noResults);
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
