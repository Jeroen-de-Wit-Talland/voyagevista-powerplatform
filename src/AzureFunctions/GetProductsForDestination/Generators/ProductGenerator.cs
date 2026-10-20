using System;
using Bogus;
using VoyageVistaSales.Azure.Functions.Models;

namespace VoyageVistaSales.Azure.Functions.Generators;

public abstract class ProductGenerator<T> : Faker<T> where T : ProductBase
{
    protected ProductGenerator(string destination)
    {
        UseSeed(Seed.From(destination, typeof(T).Name));
        RuleFor(p => p.Id, f => Guid.NewGuid());
        RuleFor(p=> p.Currency, f=> "EUR");
        RuleFor(p => p.ThumbnailURL, f => f.Image.PicsumUrl(200,200));
        RuleFor(p => p.Destination, f => destination);
        RuleFor(p => p.Price, f => Math.Round(f.Random.Decimal(0, 2000), 2));
        RuleFor(p => p.Name, f => CreateName(f, destination));
    }

    protected abstract string CreateName(Faker f, string destination);    

    
}
