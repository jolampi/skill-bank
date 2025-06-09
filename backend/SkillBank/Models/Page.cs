namespace SkillBank.Models;

/// <summary>
/// Wrapper around a full list of results that will be aligned with paged responses.
/// </summary>
/// <typeparam name="T">Response item type</typeparam>
/// <param name="Results">The list.</param>
public record Unpaged<T>
{
    public required IEnumerable<T> Results { get; init; }
}
