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
          event_id,
          eventName,
          items,
          event_definition,
          platform,
          stakeholders,
          category,
          source,
          action,
        } = req.body;
    
        if (
          !organization_id ||
          !application_id ||
          !eventName ||
          !stakeholders ||
          !event_definition ||
          !platform ||
          !category ||
          !source ||
          !action
        ) {
          return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        let existingEvent;
        if (event_id) {
          existingEvent = await Event.findById(event_id).populate("items");
        }
        
        const itemRefs = [];
        if (items && items.length > 0) {
          for (const item of items) {
            const newItem = await Item.create(item);
            itemRefs.push(newItem._id);
          }
        }
    
        if (existingEvent) {
          for (const oldItem of existingEvent.items) {
            await Item.findByIdAndDelete(oldItem._id);
          }
    
          existingEvent.items = itemRefs;
          existingEvent.stakeholders = stakeholders;
          existingEvent.category = category;
          existingEvent.source = source;
          existingEvent.action = action;
          existingEvent.event_definition = event_definition;
          existingEvent.platform = platform;
    
          await existingEvent.save();
        } else {
         
          const newEvent = await Event.create({
            eventName,
            items: itemRefs,
            stakeholders,
            category,
            event_definition,
            platform,
            source,
            action,
          });
    
          await Application.findByIdAndUpdate(application_id, {
            $push: { events: newEvent._id },
          });
        }
    
        const allEvents = await Event.find().populate("items");
    
        return res.status(201).json({
          success: true,
          message: existingEvent
            ? "Event updated successfully"
            : "Event created successfully",
          events: allEvents,
        });
      } catch (error) {
        console.error("Error processing event:", error);
        return res.status(500).json({
          success: false,
          message: "Server error",
          error: error.message,
        });
      }
    }
      
    case "PUT": {
      try {
        const { id } = req.query;
        const {
          items,
          event_definition,
          platform,
          stakeholders,
          category,
          source,
          action,
        } = req.body;

        const requiredFields = [
          "items",
          "event_definition",
          "platform",
          "stakeholders",
          "category",
          "source",
          "action",
        ];
        
        const missingFields = [];
        for (const field of requiredFields) {
          if (!req.body[field]) {
            missingFields.push(field);
          }
        }
        
        if (missingFields.length > 0) {
          return res
            .status(400)
            .json({ success: false, message: "Missing required fields", missingFields });
        }
    
        if (!id) {
          return res.status(400).json({ success: false, message: "Missing event ID" });
        }
    
        const event = await Event.findById(id).populate("items");
        if (!event) {
          return res.status(404).json({ success: false, message: "Event not found" });
        }
    
        if (items && items.length > 0) {
          await Item.deleteMany({ _id: { $in: event.items } });
          const itemRefs = [];
          for (const item of items) {
            const newItem = await Item.create(item);
            itemRefs.push(newItem._id);
          }
          event.items = itemRefs;
        }
    
        event.stakeholders = stakeholders || event.stakeholders;
        event.category = category || event.category;
        event.source = source || event.source;
        event.action = action || event.action;
        event.platform = platform || event.platform;
        event.event_definition = event_definition || event.event_definition;
        
        await event.save();
    
        return res.status(200).json({ success: true, message: "Event updated successfully", event });
      } catch (error) {
        console.error("Error updating event:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
      }
    }
    
    
      
    case 'DELETE': {
      try {
        const { application_id, event_id } = req.query;
    
        if (!application_id || !event_id) {
          return res.status(400).json({ success: false, message: "Missing required fields" });
        }
    
        const event = await Event.findById(event_id);
        if (!event) {
          return res.status(404).json({ success: false, message: "Event not found" });
        }
    
        if (event.items && event.items.length > 0) {
          await Item.deleteMany({ _id: { $in: event.items } });
        }
    
        await Event.findByIdAndDelete(event_id);
    
        await Application.findByIdAndUpdate(application_id, {
          $pull: { events: event_id },
        });
    
        return res.status(200).json({
          success: true,
          message: "Event and associated items deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting event:", error);
        return res.status(500).json({
          success: false,
          message: "Server error",
          error: error.message,
        });
      }
    }
    
    default:
      res.setHeader("Allow", ["POST", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default connectDB(handler);
