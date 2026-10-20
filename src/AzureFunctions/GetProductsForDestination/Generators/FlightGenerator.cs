using System;
using Bogus;
using CountryData.Bogus;
using VoyageVistaSales.Azure.Functions.BogusData;
using VoyageVistaSales.Azure.Functions.Models;

namespace VoyageVistaSales.Azure.Functions.Generators;

public class FlightGenerator : ProductGenerator<FlightModel>
    {
        public FlightGenerator(string destination) : base(destination)
        {
            UseSeed(Seed.From(destination, "FlightGenerator"));
            RuleFor(f => f.Id, f => Guid.NewGuid());
            RuleFor(f => f.FlightNumber, f => $"{f.Random.String2(2, "ABCDEFGHIJKLMNOPQRSTUVWXYZ")}-{f.Random.Number(1000, 9999)}");
            RuleFor(f => f.Airline, f => f.Random.Enum<FlightDataEnums.Airlines>().ToString());
            RuleFor(f => f.Destination, f => destination);
            RuleFor(f => f.DepartureAirportCode, f => f.Random.Enum<FlightDataEnums.IataAirportCode>().ToString());
            RuleFor(f => f.ArrivalAirportCode, f => f.Random.Enum<FlightDataEnums.IataAirportCode>().ToString());
            RuleFor(f => f.DepartureTime, f => f.Date.Between(DateTime.Now, DateTime.Now.AddDays(5)));
            RuleFor(f => f.ArrivalTime, (f, flight) => flight.DepartureTime.AddHours(f.Random.Double(1, 12)));
            RuleFor(f => f.Terminal, f => $"T{f.Random.Number(1, 5)}");
            RuleFor(f => f.Gate, f => $"G{f.Random.Number(1, 20)}");
            RuleFor(f => f.Price, f => Math.Round(f.Random.Decimal(100, 2000), 2));
            RuleFor(f => f.AvailableSeats, f => f.Random.Number(0, 150));
        }

    protected override string CreateName(Faker f, string destination)
    {
        return $"{f.Random.Enum<FlightDataEnums.Airlines>().ToString()} Flight to {destination}";
    }
}
