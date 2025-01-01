import connectDB from "@/utils/mongoose";
import Event from "@/models/event";
import Item from "@/models/item";
import Application from "@/models/application";

async function handler(req, res) {

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache'); 
  res.setHeader('Expires', '0');

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
          identify,
          unidentify,
          status,
        } = req.body;

        // Validate required fields
        if (
          !organization_id ||
          !application_id ||
          !eventName ||
          !stakeholders ||
          !event_definition ||
          !platform ||
          !category ||
          !source
        ) {
          return res
            .status(400)
            .json({ success: false, message: "Missing required fields" });
        }

        if (!event_id) { 
          const duplicateEvent = await Event.findOne({
            eventName,
            organization_id, 
          });
    
          if (duplicateEvent) {
            return res.status(409).json({
              success: false,
              message: `An event with the name "${eventName}" already exists in this organization.`,
            });
          }
        }

        // Check if event exists (for update)
        let existingEvent;
        if (event_id) {
          existingEvent = await Event.findById(event_id).populate("items");
        }

        // Aggregate properties
        const aggregatedUserProperties = [];
        const aggregatedEventProperties = [];
        const aggregatedSuperProperties = [];

        // if (items && items.length > 0) {
        //   for (const item of items) {
        //     // Handle user properties
        //     if (item.user_property && Array.isArray(item.user_property)) {
        //       aggregatedUserProperties.push(...item.user_property);
        //     }

        //     // Validate and handle event properties
        //     if (
        //       item.event_property &&
        //       item.event_property.property_name &&
        //       item.event_property.data_type &&
        //       item.event_property.property_type
        //     ) {
        //       console.log("Valid event_property:", );
        //       aggregatedEventProperties.push(item.event_property);
        //     } else if (item.event_property) {
        //       console.warn(
        //         "Skipping invalid event_property:",
        //         JSON.stringify(item.event_property)
        //       );
        //     }

        //     // Handle super properties
        //     if (item.super_property && Array.isArray(item.super_property)) {
        //       aggregatedSuperProperties.push(...item.super_property);
        //     }
        //   }
        // }
        if (items && items.length > 0) {
          for (const item of items) {
            // Handle user properties
            if (item.user_property && Array.isArray(item.user_property)) {
              aggregatedUserProperties.push(...item.user_property);
            }
        
            // Validate and handle event properties
            if (item.event_property) {
              if (Array.isArray(item.event_property)) {
                aggregatedEventProperties.push(...item.event_property);
              } else if (item.event_property.property_name) {
                aggregatedEventProperties.push(item.event_property); // Handle single object
              }
            }
        
            // Handle super properties
            if (item.super_property && Array.isArray(item.super_property)) {
              aggregatedSuperProperties.push(...item.super_property);
            }
          }
        }
        console.log("Aggregated event Properties:", aggregatedEventProperties);

        // Create aggregated item
        const aggregatedItem = await Item.create({
          user_property: aggregatedUserProperties,
          event_property: aggregatedEventProperties,
          super_property: aggregatedSuperProperties,
        });

        if (existingEvent) {
          // Remove old items and update event
          await Item.deleteMany({ _id: { $in: existingEvent.items } });
          existingEvent.items = [aggregatedItem._id];
          existingEvent.stakeholders = stakeholders;
          existingEvent.category = category;
          existingEvent.source = source;
          existingEvent.action = action;
          existingEvent.event_definition = event_definition;
          existingEvent.platform = platform;
          existingEvent.identify = identify;
          existingEvent.unidentify = unidentify;
          existingEvent.status = status;
          await existingEvent.save();
        } else {
          // Create a new event
          const newEvent = await Event.create({
            eventName,
            items: [aggregatedItem._id],
            stakeholders,
            category,
            event_definition,
            platform,
            source,
            action,
            identify,
            unidentify,
            status,
          });

          // Add event to application
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
          identify,
          unidentify,
        } = req.body;

        if (!id) {
          return res
            .status(400)
            .json({ success: false, message: "Missing event ID" });
        }

        const event = await Event.findById(id).populate("items");
        if (!event) {
          return res
            .status(404)
            .json({ success: false, message: "Event not found" });
        }

       // Aggregate properties
       const aggregatedUserProperties = [];
       const aggregatedEventProperties = [];
       const aggregatedSuperProperties = [];

       if (items && items.length > 0) {
         for (const item of items) {
           // Handle user properties
           if (item.user_property && Array.isArray(item.user_property)) {
             aggregatedUserProperties.push(...item.user_property);
           }

           // Validate and handle event properties
           if (
             item.event_property &&
             item.event_property.property_name &&
             item.event_property.data_type &&
             item.event_property.property_type
           ) {
             aggregatedEventProperties.push(item.event_property);
           } else if (item.event_property) {
             console.warn(
               "Skipping invalid event_property:",
               JSON.stringify(item.event_property)
             );
           }

           // Handle super properties
           if (item.super_property && Array.isArray(item.super_property)) {
             aggregatedSuperProperties.push(...item.super_property);
           }
         }
        }
        console.log("Aggregated event Properties:", aggregatedEventProperties);

       // Create aggregated item
       const aggregatedItem = await Item.create({
         user_property: aggregatedUserProperties,
         event_property: aggregatedEventProperties,
         super_property: aggregatedSuperProperties,
       });

        // Update event
        event.items = [aggregatedItem._id];
        event.stakeholders = stakeholders || event.stakeholders;
        event.category = category || event.category;
        event.source = source || event.source;
        event.action = action || event.action;
        event.platform = platform || event.platform;
        event.event_definition = event_definition || event.event_definition;
        event.identify = identify || event.identify;
        event.unidentify = unidentify || event.unidentify;

        await event.save();

        return res
          .status(200)
          .json({ success: true, message: "Event updated successfully", event });
      } catch (error) {
        console.error("Error updating event:", error);
        return res.status(500).json({
          success: false,
          message: "Server error",
          error: error.message,
        });
      }
    }

    case "DELETE": {
      try {
        const { application_id, event_id } = req.query;

        if (!application_id || !event_id) {
          return res
            .status(400)
            .json({ success: false, message: "Missing required fields" });
        }

        const event = await Event.findById(event_id);
        if (!event) {
          return res
            .status(404)
            .json({ success: false, message: "Event not found" });
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
