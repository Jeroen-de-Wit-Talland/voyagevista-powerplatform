using System;
using VoyageVistaSales.Plugins.Models;
using Microsoft.Xrm.Sdk;
using DataverseUnitTest;

namespace VoyageVistaSales.Plugins.Tests.Builders;

public class voy_QuoteLineItemBuilder : EntityBuilder<voy_QuoteLineItem, voy_QuoteLineItemBuilder>
{
    public voy_QuoteLineItem QuoteLineItem {get;set;}

    public voy_QuoteLineItemBuilder()
    {
        QuoteLineItem = new voy_QuoteLineItem()
        {
            voy_Name = "Sample Quote Line Item",
            voy_Description = "This is a sample quote line item for testing purposes.",
            voy_Amount = new Random().Next(1, 5),
            voy_PricePerUnit = new Random().Next(100, 500)
        };
    }
    public voy_QuoteLineItemBuilder(Id id)
    : this()
    {
        Id = id;
    }
    public voy_QuoteLineItemBuilder(Id<voy_Quote> existingQuote)
    {
        QuoteLineItem = new voy_QuoteLineItem()
        {
            voy_QuoteLineItemId = Guid.NewGuid(),
            voy_QuoteId = new EntityReference(voy_Quote.EntityLogicalName, existingQuote.EntityId),
            voy_Name = "Sample Quote Line Item",
            voy_Description = "This is a sample quote line item for testing purposes.",
            voy_Amount = new Random().Next(1, 5),
            voy_PricePerUnit = new Random().Next(100, 500),
            voy_DiscountPercentage = 0
        };
    }
    protected override voy_QuoteLineItem BuildInternal()
    {
        return QuoteLineItem;
    }
}
