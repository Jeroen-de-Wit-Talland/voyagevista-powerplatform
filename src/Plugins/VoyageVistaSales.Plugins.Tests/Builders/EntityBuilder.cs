using System;
using DataverseUnitTest.Builders;
using Microsoft.Xrm.Sdk;

namespace VoyageVistaSales.Plugins.Tests.Builders;

public abstract class EntityBuilder<TEntity, TBuilder> : DLaBEntityBuilder<TEntity, TBuilder>
        where TBuilder : EntityBuilder<TEntity, TBuilder>
        where TEntity : Entity
    {

    }