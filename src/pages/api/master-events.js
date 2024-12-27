import connectDB from "@/utils/mongoose";
import MasterEvent from "@/models/masterEvents";
import Item from "@/models/item";

async function handler(req, res) {
  if (req.method === "POST") {
    const {
      eventName,
      items,
      event_definition,
      platform,
      stakeholders,
      category,
      source,
      action,
      identify,
      unidentify,
      id,
    } = req.body;

    // Validate required fields
    const requiredFields = [
      "eventName",
      "event_definition",
      "platform",
      "stakeholders",
      "category",
      "source",
      "action",
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields", missingFields });
    }

    try {
      // Find existing master event
      let existingEvent = await MasterEvent.findOne({ _id: id }).populate("items");

      const itemRefs = [];
      if (items && items.length > 0) {
        for (const item of items) {
          // Create or update individual item
          const newItem = await Item.create({
            user_property: item.user_property || [],
            event_property: item.event_property || [],
            super_property: item.super_property || [],
          });
          itemRefs.push(newItem._id);
        }
      }

      if (existingEvent) {
        // Update existing event
        for (const oldItem of existingEvent.items) {
          await Item.findByIdAndDelete(oldItem._id);
        }
        existingEvent.eventName = eventName;
        existingEvent.items = itemRefs;
        existingEvent.event_definition = event_definition;
        existingEvent.platform = platform;
        existingEvent.stakeholders = stakeholders;
        existingEvent.category = category;
        existingEvent.source = source;
        existingEvent.action = action;
        existingEvent.identify = identify;
        existingEvent.unidentify = unidentify;
        await existingEvent.save();
      } else {
        // Create new master event
        await MasterEvent.create({
          eventName,
          items: itemRefs,
          event_definition,
          platform,
          stakeholders,
          category,
          source,
          action,
          identify,
          unidentify,
        });
      }

      const totalEvents = await MasterEvent.find().populate("items");
      return res.status(201).json({
        success: true,
        message: existingEvent
          ? "Master Event updated successfully"
          : "Master Event created successfully",
        totalEvents,
      });
    } catch (error) {
      console.error("Error processing Master Event:", error);
      return res.status(500).json({ success: false, error: "Internal server error" });
    }
  } else if (req.method === "GET") {
    try {
      const totalEvents = await MasterEvent.find().populate("items");
      res.status(200).json({ totalEvents });
    } catch (error) {
      console.error("Error fetching Master Events:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ success: false, message: "Missing event ID" });
    }

    try {
      const eventToDelete = await MasterEvent.findById(id).populate("items");

      if (!eventToDelete) {
        return res.status(404).json({ success: false, message: "Event not found" });
      }

      for (const item of eventToDelete.items) {
        await Item.findByIdAndDelete(item._id);
      }

      await MasterEvent.findByIdAndDelete(id);

      const totalEvents = await MasterEvent.find().populate("items");
      return res.status(200).json({
        success: true,
        message: "Master Event deleted successfully",
        totalEvents,
      });
    } catch (error) {
      console.error("Error deleting Master Event:", error);
      return res.status(500).json({ success: false, error: "Internal server error" });
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}

export default connectDB(handler);
