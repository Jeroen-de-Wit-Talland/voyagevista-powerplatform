using System.Text.Json;
using Bogus;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using CountryData.Bogus;

namespace VoyageVistaSales.Azure.Functions;

public class GetFlightsForDestination
{
    private readonly ILogger<GetFlightsForDestination> _logger;
    public class Parameters
    {
        public string Destination { get; set; } = string.Empty;
        public DateTime DepartureDate { get; set; } = DateTime.Now;
        public DateTime ReturnDate { get; set; } = DateTime.Now.AddDays(7);
    }

    private enum FlightClass
    {
        Economy,
        Business,
        First
    }

    private enum Airlines
    {
        KLM,
        Transavia,
        RyanAir,
        EasyJet,
        Lufthansa,
        BritishAirways,
        AirFrance,
        Emirates,
        QatarAirways,
        SingaporeAirlines,
        Delta,
        United

    }
    private class FlightModel
    {
        public Guid Id { get; set; }
        public string FlightNumber { get; set; } = string.Empty; // e.g., "AA-1234"
        public string Airline { get; set; } = string.Empty;

        public string Destination { get; set; } = string.Empty; // e.g., "New York"
        public string DepartureAirportCode { get; set; } = string.Empty; // e.g., "LAX"
        public string ArrivalAirportCode { get; set; } = string.Empty;   // e.g., "JFK"
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public string Terminal { get; set; } = string.Empty;
        public string Gate { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Currency { get; set; } = "EUR";
        public int AvailableSeats { get; set; }
    }

    private class FlightFaker : Faker<FlightModel>
    {        
        public FlightFaker()
        {
            RuleFor(f => f.Id, f => Guid.NewGuid());
            RuleFor(f => f.FlightNumber, f => $"{f.Random.String2(2, "ABCDEFGHIJKLMNOPQRSTUVWXYZ")}-{f.Random.Number(1000, 9999)}");
            RuleFor(f => f.Airline, f => f.Random.Enum<Airlines>().ToString());
            RuleFor(f => f.Destination, f=> f.PickRandom<string>(CountryDataSet.TheNetherlands().Place().Name));
            RuleFor(f => f.DepartureAirportCode, f => f.Address.CountryCode());
            RuleFor(f => f.ArrivalAirportCode, f => f.Address.CountryCode());
            RuleFor(f => f.DepartureTime, f => f.Date.Between(DateTime.Now, DateTime.Now.AddDays(5)));
            RuleFor(f => f.ArrivalTime, (f, flight) => flight.DepartureTime.AddHours(f.Random.Double(1, 12)));
            RuleFor(f => f.Terminal, f => $"T{f.Random.Number(1, 5)}");
            RuleFor(f => f.Gate, f => $"G{f.Random.Number(1, 20)}");
            RuleFor(f => f.Price, f => Math.Round(f.Random.Decimal(100, 2000), 2));
            RuleFor(f => f.AvailableSeats, f => f.Random.Number(0, 150));
        }
    }
    public GetFlightsForDestination(ILogger<GetFlightsForDestination> logger)
    {
        _logger = logger;
    }

    [Function("GetFlightsForDestination")]
    public IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequest req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request.");

        Parameters p = new Parameters
        {
            Destination = req.Query["destination"],
            DepartureDate = DateTime.TryParse(req.Query["departureDate"], out var depDate) ? depDate : DateTime.Now,
            ReturnDate = DateTime.TryParse(req.Query["returnDate"], out var retDate) ? retDate : DateTime.Now.AddDays(7)
        };


        var flightFaker = new FlightFaker();
        var flights = flightFaker.Generate(100);
        flights = flights.Where(f => f.Destination.Equals(p.Destination, StringComparison.OrdinalIgnoreCase)).ToList();        
        return new OkObjectResult(JsonSerializer.Serialize(flights, new JsonSerializerOptions { WriteIndented = true }));
    }
}