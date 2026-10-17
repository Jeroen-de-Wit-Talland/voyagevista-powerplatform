using DataverseUnitTest;
using DataverseUnitTest.Builders;
using DLaB.Xrm;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using VoyageVistaSales.Plugins.Models;
using VoyageVistaSales.Plugins.Tests.Builders;

namespace VoyageVistaSales.Plugins.Tests;

[TestClass]
public class CalculateQuoteTotalTests
{
  [TestMethod]
  public void CalculateQuoteTotal_Should_Return_Zero_When_No_LineItems_Are_Present()
  {
    new CalculateQuoteTotal_Should_Return_Zero_When_No_LineItems_Are_Present_Test().Test();
  }

  [TestMethod]
  public void CalculateQuoteTotal_Should_Return_MoreThenZero_When_LineItems_Are_Present()
  {
    new CalculateQuoteTotal_Should_Return_MoreThenZero_When_LineItems_Are_Present_Test().Test();
  }

  private class CalculateQuoteTotal_Should_Return_Zero_When_No_LineItems_Are_Present_Test : TestMethodClassBase
  {
    private struct Ids
    {
      public static readonly Id<voy_Quote> quoteTestId = new Id<voy_Quote>(Guid.NewGuid());
    }

    protected override void InitializeTestData(IOrganizationService service)
    {
      base.InitializeTestData(service);

      new CrmEnvironmentBuilder().WithEntities<voy_Quote>(Ids.quoteTestId).Create(service);
    }
    protected override void Test(IOrganizationService service)
    {
      var customAction = new CalculateQuoteTotal(null, null);
      var context = new PluginExecutionContextBuilder()
      .WithTarget(Ids.quoteTestId.EntityReference)
      .Build();

      var provider = new ServiceProviderBuilder(service, context, Logger).Build();

      customAction.Execute(provider);

      var quote = service.GetEntity<voy_Quote>(Ids.quoteTestId);

      Assert.AreEqual(0, quote.voy_Total.Value, "Expected Total to be 0 when no line items are present.");
    }
  }

  private class CalculateQuoteTotal_Should_Return_MoreThenZero_When_LineItems_Are_Present_Test : TestMethodClassBase
  {
    private struct Ids
    {
      public static readonly Id<voy_Quote> quoteTestId = new Id<voy_Quote>(Guid.NewGuid());
    }

    protected override void InitializeTestData(IOrganizationService service)
    {
        new CrmEnvironmentBuilder().WithBuilder<voy_QuoteBuilder>(Ids.quoteTestId, b=> b.WithLineItems(Ids.quoteTestId))        
        .Create(service);        
    }

    protected override void Test(IOrganizationService service)
    {
      CalculateQuoteTotal customAction = new CalculateQuoteTotal(null, null);
      var context = new PluginExecutionContextBuilder()          
          .WithTarget(Ids.quoteTestId.EntityReference)
          .Build();

      var provider = new ServiceProviderBuilder(service, context, Logger).Build();

      customAction.Execute(provider);

      var quote = service.GetEntity<voy_Quote>(Ids.quoteTestId);

      Assert.IsGreaterThan(0, quote.voy_Total.Value, "Expected Total to be greater than 0 when line items are present.");
    }
  }
}
