using System;
using DataverseUnitTest;
using DataverseUnitTest.Builders;
using Microsoft.Xrm.Sdk;

namespace VoyageVistaSales.Plugins.Tests;

public abstract class TestMethodClassBase : TestMethodClassBaseDLaB
{
    protected override IAgnosticServiceBuilder GetOrganizationServiceBuilder(IOrganizationService service) { return new Builders.OrganizationServiceBuilder(service); }

    protected override void LoadConfigurationSettings()
    {
        TestInitializer.InitializeTestSettings();
    }

    public void Test()
    {
        Test(new DebugLogger());
    }
}
