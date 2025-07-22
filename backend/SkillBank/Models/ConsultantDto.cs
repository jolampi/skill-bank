namespace SkillBank.Models;

public record ConsultantSearchParamsDto(List<UserSkillFilterDto> Skills);

public record UserSkillFilterDto
{
    public required string Label { get; init; }
    public int MinimumExperience { get; init; }
    public int MinimumProficiency { get; init; }
}

public record ConsultantListDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required int Skills { get; init; }
}

public record ConsultantDetailsDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required List<UserSkillDto> Skills { get; init; }
}
