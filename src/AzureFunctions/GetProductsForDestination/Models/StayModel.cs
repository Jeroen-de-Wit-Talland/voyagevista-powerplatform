using System;

namespace VoyageVistaSales.Azure.Functions.Models;

public class StayModel : ProductBase
{
    public decimal Rating { get; set; } // e.g., 4.5

    public int NumberOfNights { get; set; } // e.g., 3

    public string Type { get; set; } = string.Empty; // e.g., "Hotel", "Hostel", "Resort"
    
}
