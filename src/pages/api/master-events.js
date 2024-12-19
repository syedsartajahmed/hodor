import connectDB from "@/utils/mongoose";
import MasterEvent from "@/models/masterEvents";
import Event from "@/models/event";
import Item from "@/models/item";
import Application from "@/models/application";
import Organization from "@/models/organization";

async function handler(req, res) {
    if (req.method === "GET") {
        try {
        const totalEvents = await MasterEvent.find().populate('items');
        res.status(200).json({totalEvents});
    } catch (error) {
        console.error("Error fetching counts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
    } else if (req.method === 'POST') {
        const {
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
        try {
            let existingEvent = await MasterEvent.findOne({ eventName }).populate("items");

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
                await MasterEvent.create({
                eventName,
                items: itemRefs,
                stakeholders,
                category,
                propertyBundles,
                groupProperty,
                source,
                action,
                });
            }

            const totalEvents = await MasterEvent.find().populate("items");
            res.status(201).json({
              success: true,
              message: existingEvent
                ? "MasterEvent updated successfully"
                : "MasterEvent created successfully",
              totalEvents: totalEvents,
            });
          } catch (error) {
            console.error("Error processing MasterEvent:", error);
            res.status(500).json({ success: false, error: "Internal server error" });
          }
    } else if (req.method === "DELETE") {
        const { id } = req.query; 
        if (!id) {
          return res
            .status(400)
            .json({ success: false, message: "Missing event ID" });
        }
    
        try {
          const eventToDelete = await MasterEvent.findById(id).populate("items");
    
          if (!eventToDelete) {
            return res
              .status(404)
              .json({ success: false, message: "Event not found" });
          }
    
          for (const item of eventToDelete.items) {
            await Item.findByIdAndDelete(item._id);
            }
            
          await MasterEvent.findByIdAndDelete(id);
    
          const totalEvents = await MasterEvent.find().populate("items");
          res.status(200).json({
            success: true,
            message: "MasterEvent deleted successfully",
            totalEvents,
          });
        } catch (error) {
          console.error("Error deleting MasterEvent:", error);
          res.status(500).json({ success: false, error: "Internal server error" });
        }
      } else {
        res.status(405).json({ success: false, error: "Method not allowed" });
      }
}

export default connectDB(handler);
