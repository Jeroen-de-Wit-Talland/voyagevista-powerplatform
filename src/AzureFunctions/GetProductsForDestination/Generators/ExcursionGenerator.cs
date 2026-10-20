using System;
using Bogus;
using VoyageVistaSales.Azure.Functions.Generators;
using VoyageVistaSales.Azure.Functions.Models;

namespace VoyageVistaSales.Azure.Functions.Generators;

public class ExcursionGenerator : ProductGenerator<ExcursionModel>
{
    public ExcursionGenerator(string destination) : base(destination)
    {
        RuleFor(e=> e.Category, f=> f.PickRandom(new []{"Adventure", "Cultural", "Relaxation", "Nature", "Historical"}));
        RuleFor(e=> e.DurationInHours, f=> f.Random.Int(1, 8));
    }

    protected override string CreateName(Faker f, string destination)
    {
        return $"{f.Hacker.Adjective()} {destination} tour";
    }
}
