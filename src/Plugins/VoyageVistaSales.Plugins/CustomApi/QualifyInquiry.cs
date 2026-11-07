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

            // TODO: implement the "voy_QualifyInquiry" operation.
            // Read typed inputs from 'request', set typed outputs on 'response'.
            using (var XrmSvc = new XrmSvc(organizationServiceFactory.CreateOrganizationService(context.UserId)))
            {
                try
                {
                    if(!context.InputParameters.Contains("CreateQuote") || !(context.InputParameters["CreateQuote"] is bool createQuote))
                    {
                        throw new InvalidPluginExecutionException("Missing or invalid CreateQuote parameter.");
                    }
                    if (!context.InputParameters.Contains("Target") || !(context.InputParameters["Target"] is EntityReference target))
                    {
                        throw new InvalidPluginExecutionException("Missing or invalid Target parameter.");
                    }
                    else if (!context.InputParameters.Contains("Status") || !(context.InputParameters["Status"] is voy_TravelInquiry_StatusCode status))
                    {
                        throw new InvalidPluginExecutionException("Missing or invalid Status parameter.");
                    }

                    var statusCode = (voy_TravelInquiry_StatusCode)context.InputParameters["Status"];
                    var inquiry = (EntityReference)context.InputParameters["Target"];                                        
                    switch (statusCode)
                    {
                        case voy_TravelInquiry_StatusCode.Won:
                            if(createQuote)
                            {
                                var quote = new voy_Quote
                                {
                                    voy_TravelInquiryId = inquiry
                                };
                                XrmSvc.AddObject(quote);
                                                                
                                XrmSvc.SaveChanges();
                                context.OutputParameters["CreatedQuote"] = quote;
                            }
                            else
                            {
                                throw new InvalidPluginExecutionException("CreateQuote must be true when Status is Won.");
                            }
                            break;
                        case voy_TravelInquiry_StatusCode.Lost:
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
