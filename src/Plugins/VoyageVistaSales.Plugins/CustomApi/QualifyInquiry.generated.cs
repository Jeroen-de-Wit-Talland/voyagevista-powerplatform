using System;
using Microsoft.Xrm.Sdk;

// GENERATED FILE — regenerated from voy_QualifyInquiry.customapi.json whenever the definition
// changes. Do not edit: your changes here WILL be overwritten. Your implementation belongs in
// QualifyInquiry.cs, which is written once and never regenerated.

namespace VoyageVistaSales.Plugins
{
    /// <summary>
    /// Typed request wrapper for the "voy_QualifyInquiry" Custom API — reads InputParameters as typed values.
    /// </summary>
    public sealed class QualifyInquiryRequest
    {
        private readonly IPluginExecutionContext _context;
        public QualifyInquiryRequest(IPluginExecutionContext context) => _context = context;

        /// <summary>Create Quote if true.</summary>
        public bool CreateQuote =>
            _context.InputParameters.Contains("CreateQuote") ? (bool)_context.InputParameters["CreateQuote"] : default(bool);

        /// <summary>Status of the inquiry.</summary>
        public OptionSetValue Status =>
            _context.InputParameters.Contains("Status") ? (OptionSetValue)_context.InputParameters["Status"] : default(OptionSetValue);
    }

    /// <summary>
    /// Typed response wrapper for the "voy_QualifyInquiry" Custom API — writes OutputParameters.
    /// </summary>
    public sealed class QualifyInquiryResponse
    {
        private readonly IPluginExecutionContext _context;
        public QualifyInquiryResponse(IPluginExecutionContext context) => _context = context;

        /// <summary>Created Quote Record.</summary>
        public Entity CreatedQuote
        {
            set => _context.OutputParameters["CreatedQuote"] = value;
        }
    }
}
