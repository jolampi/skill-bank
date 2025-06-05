using System.Reflection.Emit;

namespace SkillBank.Models;

public record SkillDto
{
    public required Guid Id { get; init; }
    public required string Label { get; init; }
    public required int Developers { get; init; }
}

