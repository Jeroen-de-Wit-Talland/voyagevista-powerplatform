using System;
using System.Linq;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using VoyageVistaSales.Xrm.Models;

// YOUR FILE — written once when the handler was first generated, and never overwritten. Regenerating
// refreshes QualifyInquiry.generated.cs (the typed wrappers) and leaves this alone.

namespace VoyageVistaSales.Plugins
{
    /// <summary>
    /// Implements the "voy_QualifyInquiry" Custom API message.
    /// Registered as plugin type VoyageVistaSales.Plugins.QualifyInquiry.
    /// </summary>
    public sealed class QualifyInquiry : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            var context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            var tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            var organizationServiceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));

            if (organizationServiceFactory is IProxyTypesAssemblyProvider proxyProvider)
            {
                proxyProvider.ProxyTypesAssembly = typeof(XrmSvc).Assembly;
            }

            var service = organizationServiceFactory.CreateOrganizationService(context.UserId);

            using (var svc = new XrmSvc(service))
            {
                try
                {
                    if (!context.InputParameters.Contains("Target"))
                    {
                        throw new InvalidPluginExecutionException("Missing or invalid Target parameter.");
                    }
                    else if (!context.InputParameters.Contains("Status"))
                    {
                        throw new InvalidPluginExecutionException("Missing or invalid Status parameter.");
                    }

                    OptionSetValue statusCode = (OptionSetValue)context.InputParameters["Status"];
                    var target = (EntityReference)context.InputParameters["Target"];
                    voy_TravelInquiry inquiry = svc.voy_TravelInquirySet.FirstOrDefault(i => i.Id == target.Id);

                    if(inquiry.StatusCode != null && (inquiry.StatusCode.Value == voy_TravelInquiry_StatusCode.Won || inquiry.StatusCode.Value == voy_TravelInquiry_StatusCode.Lost))
                    {
                        throw new InvalidPluginExecutionException("This inquiry has already been qualified.");
                    }

                    switch (statusCode.Value)
                    {
                        case (int)voy_TravelInquiry_StatusCode.Won:
                            inquiry.StatusCode = voy_TravelInquiry_StatusCode.Won;
                            inquiry.StateCode = voy_travelinquiry_statecode.Inactive;
                            svc.UpdateObject(inquiry);
                            var quote = new voy_Quote
                            {
                                voy_TravelInquiryId = target
                            };
                            svc.AddObject(quote);

                            svc.SaveChanges();
                            
                            context.OutputParameters["QuoteId"] = quote.Id;
                            
                            break;
                        case (int)voy_TravelInquiry_StatusCode.Lost:
                            inquiry.StatusCode = voy_TravelInquiry_StatusCode.Lost;
                            inquiry.StateCode = voy_travelinquiry_statecode.Inactive;
                            svc.UpdateObject(inquiry);
                            svc.SaveChanges();
                            break;
                        default:
                            throw new InvalidPluginExecutionException("Invalid Status parameter.");
                    }
                }

                catch (Exception ex)
                {
                    tracingService.Trace("QualifyInquiry: {0}", ex.ToString());
                    throw;
                }
            }
        }
    }
}
