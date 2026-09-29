using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using VoyageVistaSales.Plugins.Models;
namespace VoyageVistaSales.Plugins
{
    /// <summary>
    /// Plugin development guide: https://docs.microsoft.com/powerapps/developer/common-data-service/plug-ins
    /// Best practices and guidance: https://docs.microsoft.com/powerapps/developer/common-data-service/best-practices/business-logic/
    /// </summary>
    public class CalculateQuoteTotal : PluginBase
    {
        private readonly static string _totalOutputParameter = "TotalAmount";
        public CalculateQuoteTotal(string unsecureConfiguration, string secureConfiguration)
            : base(typeof(CalculateQuoteTotal))
        {
            // TODO: Implement your custom configuration handling
            // https://docs.microsoft.com/powerapps/developer/common-data-service/register-plug-in#set-configuration-data
        }

        // Entry point for custom business logic execution
        protected override void ExecuteDataversePlugin(ILocalPluginContext localPluginContext)
        {
            if (localPluginContext == null)
            {
                throw new ArgumentNullException(nameof(localPluginContext));
            }

            var context = localPluginContext.PluginExecutionContext;

            try
            {
                if (context.InputParameters == null || !context.InputParameters.Contains("Target"))
                {
                    throw new InvalidPluginExecutionException("Invalid Target parameter.");
                }

                EntityReference targetEntity = (EntityReference)context.InputParameters["Target"];
                Guid? quoteId = targetEntity.Id;

                context.OutputParameters[_totalOutputParameter] = new Money();

                Money totalAmount = context.OutputParameters[_totalOutputParameter] as Money;

                if (!quoteId.HasValue)
                {
                    throw new InvalidPluginExecutionException("QuoteId is required.");
                }

                using (XrmSvc xrmSvc = new XrmSvc(localPluginContext.InitiatingUserService))
                {
                    voy_Quote quote = xrmSvc.voy_QuoteSet.FirstOrDefault(q => q.Id == quoteId.Value);
                    List<voy_QuoteLineItem> quoteLineItems = xrmSvc.voy_QuoteLineItemSet.Where(q => q.voy_QuoteId.Id == quoteId.Value).ToList();

                    decimal? total = 0;

                    if (quoteLineItems.Count == 0)
                    {
                        context.OutputParameters[_totalOutputParameter] = new Money(0);
                    }

                    foreach (var item in quoteLineItems)
                    {
                        total += item.voy_Amount * item.voy_PricePerUnit - item.voy_DiscountAmount;
                    }
                    quote.voy_Total = new Money(total ?? 0);
                    xrmSvc.UpdateObject(quote);
                    xrmSvc.SaveChanges();

                    context.OutputParameters[_totalOutputParameter] = new Money(total ?? 0);
                }
            }
            catch (Exception ex)
            {
                localPluginContext.Trace($"Exception: {ex.ToString()}");
                throw;
            }
        }
    }
}
