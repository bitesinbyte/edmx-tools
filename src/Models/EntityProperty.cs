namespace EdmxTools.Models;

public record EntityProperty
{
    public string Name { get; init; } = string.Empty;
    public string? Type { get; init; }
    public bool Nullable { get; init; }
    public bool Key { get; init; }
    public string? Value { get; init; }
}
