import connectDB from "@/utils/mongoose";
import Event from "@/models/event";
import Item from "@/models/item";
import Application from "@/models/application";
import Organization from "@/models/organization";

async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST": {
      try {
        const {
          organization_id,
          application_id,
          eventName,
          items,
          stakeholders,
          category,
          propertyBundles,
          groupProperty,
          source,
          action,
        } = req.body;

        // Validate required fields
        if (
          !organization_id ||
          !application_id ||
          !eventName ||
          !stakeholders ||
          !category ||
          !propertyBundles ||
          !groupProperty ||
          !source ||
          !action
        ) {
          return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Create and save items if provided
        const itemRefs = [];
        if (items && items.length > 0) {
          for (const item of items) {
            const newItem = await Item.create(item);
            itemRefs.push(newItem._id);
          }
        }

        // Create the event
        const newEvent = await Event.create({
          eventName,
          items: itemRefs, // References to Item documents
          stakeholders,
          category,
          propertyBundles,
          groupProperty,
          source,
          action,
        });

        // Update Application to reference the new event
        await Application.findByIdAndUpdate(application_id, {
          $push: { events: newEvent._id },
        });

        return res.status(201).json({
          success: true,
          message: "Event saved successfully",
          event: newEvent,
        });
      } catch (error) {
        console.error("Error saving event:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
      }
    }

    case "PUT": {
      try {
        const { event_id, eventName, items, stakeholders, category, propertyBundles, groupProperty, source, action } =
          req.body;

        // Validate required fields
        if (!event_id) {
          return res.status(400).json({ success: false, message: "Event ID is required" });
        }

        // Find the event
        const event = await Event.findById(event_id);
        if (!event) {
          return res.status(404).json({ success: false, message: "Event not found" });
        }

        // Update items
        if (items && items.length > 0) {
          // Clear old items
          await Item.deleteMany({ _id: { $in: event.items } });

          // Create new items
          const newItemRefs = [];
          for (const item of items) {
            const newItem = await Item.create(item);
            newItemRefs.push(newItem._id);
          }
          event.items = newItemRefs;
        }

        // Update other fields
        event.eventName = eventName || event.eventName;
        event.stakeholders = stakeholders || event.stakeholders;
        event.category = category || event.category;
        event.propertyBundles = propertyBundles || event.propertyBundles;
        event.groupProperty = groupProperty || event.groupProperty;
        event.source = source || event.source;
        event.action = action || event.action;

        // Save the updated event
        const updatedEvent = await event.save();

        return res.status(200).json({
          success: true,
          message: "Event updated successfully",
          event: updatedEvent,
        });
      } catch (error) {
        console.error("Error updating event:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
      }
    }

    default:
      res.setHeader("Allow", ["POST", "PUT"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default connectDB(handler);
