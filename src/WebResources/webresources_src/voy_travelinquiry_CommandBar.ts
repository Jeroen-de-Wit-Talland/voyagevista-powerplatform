export class voy_travelinquiry_CommandBar {
  static async QualifyInquiry(primaryControl: any): Promise<void> {
    const formContext = primaryControl;
    const pageId = "d08e0f9b-a117-4653-85cf-f3ac86e2027e";

    try {
      if (formContext.data.entity.getIsDirty()) {
        await formContext.data.save();
      }

      const pageInput = {
      pageType: "generative",
      pageId: pageId,
      entityName: primaryControl.data.entity.getEntityName(),   // optional
      recordId: primaryControl.data.entity.getId()       // optional
    };

    const navigationOptions: any = {
      target: 2,                           // 2 = dialog
      position: 1,                         // 1 = centered, 2 = side dialog
      width: { value: 70, unit: "%" },
      height: { value: 80, unit: "%" },
      title: "Qualify Inquiry"
    };

    try {
      await Xrm.Navigation.navigateTo(pageInput as any, navigationOptions);
      // Runs when the dialog is closed
      primaryControl.data.refresh(false);
    } catch (error) {
      console.error("Failed to open generative page", error);
    }
      
    } catch (error) {
      console.error("Error occurred while qualifying inquiry:", error);
    }
  }

  
}
