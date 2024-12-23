import connectDB from "@/utils/mongoose";
import Organization from "@/models/organization";
import MasterEvent from "@/models/masterEvents";
import Event from "@/models/event";
import Item from "@/models/item";
import Application from "@/models/application";

async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  const { organizationId, masterEventId } = req.body;

  if (!organizationId || !masterEventId) {
    return res.status(400).json({ success: false, error: "Organization ID and Master Event ID are required." });
  }

  try {
    const masterEvent = await MasterEvent.findById(masterEventId).populate("items");
    if (!masterEvent) {
      return res.status(404).json({ success: false, error: "Master Event not found." });
    }

    const copiedItems = await Promise.all(
      masterEvent.items.map(async (item) => {
        const newItem = new Item({
          property_type: item.property_type || "default_type",
          property_name: item.property_name || "default_name",
          property_definition: item.property_definition || "default_definition",
          data_type: item.data_type || "default_data_type",
          sample_value: item.sample_value || "null",
          method_call: item.method_call || "null",
        });
        await newItem.save();
        return newItem._id;
      })
    );

    const newEvent = new Event({
      eventName: masterEvent.eventName || "default_event_name",
      items: copiedItems,
      event_definition: masterEvent.event_definition || "default_event_definition",
      stakeholders: masterEvent.stakeholders || ["default_stakeholder"],
      category: masterEvent.category || "default_category",
      source: masterEvent.source || "default_source",
      action: masterEvent.action || "default_action",
      platform: masterEvent.platform || "default_platform",
    });
    await newEvent.save();

    const organization = await Organization.findById(organizationId).populate("applications");
    if (!organization) {
      return res.status(404).json({ success: false, error: "Organization not found." });
    }

    let webApplication = organization.applications.find((app) => app.type === "web");

    if (!webApplication) {
      webApplication = await Application.create({ type: "web", events: [] });
      organization.applications.push(webApplication._id);
      await organization.save();
    }

    webApplication.events.push(newEvent._id);
    await webApplication.save();

    return res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    console.error("Error in processing request:", error.message);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}

export default connectDB(handler);
