namespace SkillBank.Models;

public record SkillDto
{
    public required Guid Id { get; init; }
    public required string Label { get; init; }
    public required int Users { get; init; }
}
