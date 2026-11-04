<PowerTools.RegisterEvent[]>[
  {
    formId: "ef8a180b-d564-483c-98b1-17dc874caf7b",
    event: "onload",
    executionContext: true,
    triggerId: "bc186521-b163-4402-9588-6fcf3daa3adc",
    function: "voy.voy_quote.OnLoad",
  },
];


export class voy_quote {
  static async OnLoad(executionContext: Xrm.ExecutionContext<unknown, unknown>): Promise<void> {
    const form = <Form.voy_quote.Main.Information>executionContext.getFormContext();
    form.ui.setFormNotification("voy_quote loaded", "INFO", "64ec7c13-ccc5-4496-80f7-b41489aa4a17");

    this.BindEvents(form);
    this.OnLoadLogic(form);
  }

  static async OnLoadLogic(form: Form.voy_quote.Main.Information) {
    // add OnLoad logic here
    let entityId = form.data.entity.getId().replace(/[{}]/g, "");
    let destination = form.getAttribute("voy_destination").getValue();

    if (!destination || destination === "") {
      return;
    }

    const pane = await Xrm.App.sidePanes.createPane({
      title: "Quote Creator",
      paneId: "GenPage",
      canClose: true,
      width: 400
    });

    await pane.navigate({
        pageType: "generative",
        pageId: "37102c45-a0ca-41f9-b980-87219b0bc6b4",
        recordId: entityId,
        data: {
          destination: destination
        }
      });
  }

  static async BindEvents(form: Form.voy_quote.Main.Information) {
    form.data.entity.addOnSave(() => this.OnSave(form));
    //Add Bind events here
  }

  static async OnSave(executionContext: Form.voy_quote.Main.Information) {
    //Add On Save logic here
  }
}
