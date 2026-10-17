using System;
using DataverseUnitTest;
using Microsoft.Xrm.Sdk;

namespace VoyageVistaSales.Plugins.Tests.Builders;

public class OrganizationServiceBuilder : DataverseUnitTest.Builders.OrganizationServiceBuilderBase<OrganizationServiceBuilder>
{
    protected override OrganizationServiceBuilder This => this;

    #region Constructors


    public OrganizationServiceBuilder() : this(TestBase.GetOrganizationService()) { }

    public OrganizationServiceBuilder(IOrganizationService service) : base(service) { }

    #endregion Constructors
}