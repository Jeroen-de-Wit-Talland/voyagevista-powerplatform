using System;

namespace VoyageVistaSales.Azure.Functions.Models;

public class ProductBase
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty; // e.g., "New York"

    public string Currency { get; set; } = string.Empty; // e.g., "USD"

    public string ThumbnailURL { get; set; } = string.Empty; // e.g., "https://example.com/image.jpg"
    public decimal Price { get; set; }
}
