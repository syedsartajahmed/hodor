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
    
        let existingEvent = await Event.findOne({ eventName }).populate("items");
    
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
          existingEvent.propertyBundles = propertyBundles;
          existingEvent.groupProperty = groupProperty;
          existingEvent.source = source;
          existingEvent.action = action;
    
          await existingEvent.save();
        } else {
         
          const newEvent = await Event.create({
            eventName,
            items: itemRefs,
            stakeholders,
            category,
            propertyBundles,
            groupProperty,
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
      res.setHeader("Allow", ["POST", "PUT"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default connectDB(handler);
