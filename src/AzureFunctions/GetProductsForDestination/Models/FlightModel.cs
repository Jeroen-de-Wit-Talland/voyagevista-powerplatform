using System;

namespace VoyageVistaSales.Azure.Functions.Models;

public class FlightModel : ProductBase
{
    public string FlightNumber { get; set; } = string.Empty; // e.g., "AA-1234"
    public string Airline { get; set; } = string.Empty;    
    public string DepartureAirportCode { get; set; } = string.Empty; // e.g., "LAX"
    public string ArrivalAirportCode { get; set; } = string.Empty;   // e.g., "JFK"
    public DateTime DepartureTime { get; set; }
    public DateTime ArrivalTime { get; set; }
    public string Terminal { get; set; } = string.Empty;
    public string Gate { get; set; } = string.Empty;
    public int AvailableSeats { get; set; }
}
