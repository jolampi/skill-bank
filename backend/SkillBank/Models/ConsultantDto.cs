namespace SkillBank.Models;

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
