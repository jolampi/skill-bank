namespace SkillBank.Models;

public record ConsultantSearchParamsDto
{
    public int MinimumExperience { get; init; }
    public int MinimumProficiency { get; init; } = 0;
    public List<string> Skills { get; init; } = [];
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
