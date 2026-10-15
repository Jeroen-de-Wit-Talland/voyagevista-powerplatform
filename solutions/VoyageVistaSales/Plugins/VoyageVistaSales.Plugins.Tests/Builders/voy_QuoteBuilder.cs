using System;
using DataverseUnitTest;
using VoyageVistaSales.Plugins.Models;
namespace VoyageVistaSales.Plugins.Tests.Builders;

public class voy_QuoteBuilder : EntityBuilder<voy_Quote, voy_QuoteBuilder>
{
    public voy_Quote Quote {get;set;}

    public voy_QuoteBuilder()
    {
        Quote = new voy_Quote()
        {
            voy_Numberoftravelers = 2,
            voy_Destination = "Hawaii",
        };
    }

    public voy_QuoteBuilder(Id id)
    : this()
    {
        Id = id;
    }

    public voy_QuoteBuilder WithLineItems(Id<voy_Quote> existingQuote)
    {
        List<voy_QuoteLineItem> lineItems = new List<voy_QuoteLineItem>();
        for (int i = 0; i < 3; i++)
        {
            lineItems.Add(new voy_QuoteLineItemBuilder(existingQuote).Build());
        }
        Quote.voy_Quote_voy_QuoteId_voy_QuoteLineItem = lineItems;
        return this;
    }
    protected override voy_Quote BuildInternal()
    {
        return Quote;
    }
}
