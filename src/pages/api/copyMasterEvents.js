import connectDB from "@/utils/mongoose";
import Organization from "@/models/organization";
import MasterEvent from "@/models/masterEvents";
import Event from "@/models/event";
import Item from "@/models/item";
import Application from "@/models/application";

async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache'); 
  res.setHeader('Expires', '0');
  
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

    // Copy items based on their existing structure
    const copiedItems = await Promise.all(
      masterEvent.items.map(async (item) => {
        const newItem = new Item({
          user_property: item.user_property || [],
          event_property: item.event_property || [],
          super_property: item.super_property || [],
        });
        await newItem.save();
        return newItem._id;
      })
    );

    // Create a new Event, replicating the structure from the provided payload
    const newEvent = new Event({
      eventName: masterEvent.eventName || "default_event_name",
      items: copiedItems,
      event_definition: masterEvent.event_definition || "No description provided",
      stakeholders: masterEvent.stakeholders || [],
      category: masterEvent.category || "Uncategorized",
      source: masterEvent.source || ["Default Source"],
      action: masterEvent.action || "No action",
      platform: masterEvent.platform || ["Default Platform"],
      identify: masterEvent.identify || false,
      unidentify: masterEvent.unidentify || false,
    });
    await newEvent.save();

    // Find or create the web application for the organization
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

    // Link the new event to the web application
    webApplication.events.push(newEvent._id);
    await webApplication.save();

    return res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    console.error("Error in processing request:", error.message);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}

export default connectDB(handler);
