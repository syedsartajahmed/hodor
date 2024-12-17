import connectDB from "@/utils/mongoose";
import Organization from "@/models/organization";
import Application from '@/models/application';
import Event from '@/models/event';
import Item from '@/models/item';

 async function handler(req, res) {
  
  if (req.method === "POST") {
    try {
        const { organizationId, applicationType, eventName, items, stakeholders, category, propertyBundles, groupProperty, source, action } = req.body;

        if (!organizationId || !applicationType || !eventName || !items  || !stakeholders || !category || !propertyBundles || !groupProperty || !source || !action) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const organization = await Organization.findById(organizationId).populate('applications');

        if (!organization) {
          return res.status(404).json({ error: 'Organization not found' });
        }
        console.log(organization);
        if (!organization.applications || organization.applications.length === 0) {
            return res.status(404).json({ error: "No applications found for this organization" });
        }
    
        const application = organization.applications.find(app => app.type === applicationType);
        if (!application) {
          return res.status(404).json({ error: 'Application type not found in the organization' });
        }
    
        const newEvent = await Event.create({
          eventName,
          stakeholders,
          category,
          propertyBundles,
          groupProperty,
          source,
          action,
          propertyBundles,
          timestamp: new Date(),
        });
    
        if (items && Array.isArray(items)) {
            for (const item of items) {
                const newItem = await Item.create(item); 
                newEvent.items.push(newItem._id); 
            }
        }
        await newEvent.save();
    
        application.events.push(newEvent._id);
        await application.save();
    
        return res.status(201).json({ message: 'Event added successfully', newEvent });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      }
  } else if (req.method === "GET") {
    try {
        const organization = await Organization.findOne({ name: "xyz" }).populate({
            path: "applications",
            populate: {
                path: "events",
                populate: {
                    path: "items",
                },
            },
        });

        if (!organization) {
            return res.status(404).json({ error: "Organization not found" });
        }

        res.status(200).json(organization);
    } catch (error) {
        console.error("Error fetching organization data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
} else {
    
    res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }
}
export default connectDB(handler); 