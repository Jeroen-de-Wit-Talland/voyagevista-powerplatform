using System;

namespace VoyageVistaSales.Azure.Functions.Models;

public class ExcursionModel : ProductBase
{
    public string Category {get;set;} = string.Empty;

    public int DurationInHours {get;set;}
}
