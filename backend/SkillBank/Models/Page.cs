namespace SkillBank.Models;

/// <summary>
/// Wrapper around a full list of results that will be aligned with paged responses.
/// </summary>
/// <typeparam name="T">Response item type</typeparam>
public record Unpaged<T>(IEnumerable<T> Results);
