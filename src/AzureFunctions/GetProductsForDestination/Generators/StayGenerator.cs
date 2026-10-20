using System;
using Bogus;
using VoyageVistaSales.Azure.Functions.BogusData;
using VoyageVistaSales.Azure.Functions.Models;

namespace VoyageVistaSales.Azure.Functions.Generators;

public class StayGenerator : ProductGenerator<StayModel>
{
    public StayGenerator(string destination) : base(destination)
    {
        UseSeed(Seed.From(destination, "StayGenerator"));
        RuleFor(s=> s.Id, f => Guid.NewGuid());
        RuleFor(s => s.Rating, f => f.Random.Decimal(1, 5));
        RuleFor(s => s.NumberOfNights, f => f.Random.Int(1, 14));
        RuleFor(s => s.Type, f => f.Random.Enum<StayDataEnum>().ToString());
    }

    protected override string CreateName(Faker f, string destination)
    {
        return $"{f.Company.CompanyName()} {destination}";
    }

}
