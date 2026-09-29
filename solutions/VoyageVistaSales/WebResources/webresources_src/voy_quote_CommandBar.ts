export class voy_quote_CommandBar {
  static async ExecuteCalculate(primaryControl: any): Promise<void> {
    const formContext = primaryControl;

    try {
      if (formContext.data.entity.getIsDirty()) {
        await formContext.data.save();
      }

      Xrm.Utility.showProgressIndicator("Calculating quote...");

      const quoteId = formContext.data.entity.getId().replace(/[{}]/g, "");
      console.log(quoteId);
      const request = {
        entity: { entityType: "voy_quote", id: quoteId },
        getMetadata: () => ({
          boundParameter: "entity",
          parameterTypes: {
            entity: { typeName: "mscrm.voy_quote", structuralProperty: 5 },
          },
          operationType: 0,
          operationName: "voy_CalculateQuote",
        }),
      };

      const result = await Xrm.WebApi.online.execute(request);
      if (!result.ok) {
        throw new Error(`Quote calculation failed (${result.status}).`);
      }

      await formContext.data.refresh(false);
      Xrm.Utility.closeProgressIndicator();
    } catch (error: any) {
      Xrm.Navigation.openErrorDialog({
        message: error?.message ?? "An error occurred while calculating the quote.",
      });
    } finally {
      Xrm.Utility.closeProgressIndicator();
    }
  }
}