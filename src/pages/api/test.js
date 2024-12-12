import connectDB from "@/utils/mongoose";
import Organization from "@/models/organization";
import Application from '@/models/application';
import Event from '@/models/event';
import Item from '@/models/item';

 async function handler(req, res) {
  
  if (req.method === "GET") {
    try {
      //adding dummmy data
      const item1 = await Item.create({ name: 'Browser', value: 'Chrome', additionalInfo: 'Version 96' });
      const item2 = await Item.create({ name: 'Platform', value: 'Windows', additionalInfo: '10 Pro' });
      const event = await Event.create({ eventName: 'User Login', items: [item1._id, item2._id] });
      const application = await Application.create({ type: 'web', events: [event._id] });
      const organization = await Organization.create({ name: 'Example Organization', applications: [application._id] });



    //   //Fetch All Organizations and Their Items Fetch the complete structure of an organization, including items.
    //   const organizations = await Organization.find().populate({
    //     path: 'applications',
    //     populate: {
    //       path: 'events',
    //       populate: { path: 'items' },
    //     },
    //   });


    //   //Fetch a Specific Organization by Name Fetch an organization that matches a given name.
    //   const organization1 = await Organization.findOne({ name: '' }).populate({
    //     path: 'applications',
    //     populate: {
    //       path: 'events',
    //       populate: { path: 'items' },
    //     },
    //   });

    //   //Add Events to an Existing Organization Add new events to a specific organization.
    //   const { orgId, appId, eventName, items } = req.body; // Items should be ObjectIds
    //   try {
    //     // Create a new event
    //     const event = await Event.create({ eventName, items });

    //     // Find the application and add the event
    //     const application = await Application.findById(appId);
    //     application.events.push(event._id);
    //     await application.save();

    //     res.status(200).json({ success: true, data: event });
    //   } catch (error) {
    //     res.status(500).json({ success: false, error: error.message });
    //   }




    //   //5. Update Existing Event Items Update the items in an existing event for a different organization.
    //   const { eventId, newItems } = req.body; // `newItems` should be an array of ObjectIds
    //   await dbConnect();  
    //   try {
    //     const event = await Event.findById(eventId);
    //     if (!event) {
    //       return res.status(404).json({ success: false, message: 'Event not found' });
    //     }
    //     // Update items
    //     event.items = newItems;
    //     await event.save();
    //     res.status(200).json({ success: true, data: event });
    //   } catch (error) {
    //     res.status(500).json({ success: false, error: error.message });
    //   }

    //   //6. Copy Events from One Organization to Another Take one organization’s events and add them to another.
    //   const { sourceOrgId, targetOrgId } = req.body;
    // await dbConnect();

    // try {
    //   const sourceOrg = await Organization.findById(sourceOrgId).populate({
    //     path: 'applications',
    //     populate: { path: 'events' },
    //   });
    //   const targetOrg = await Organization.findById(targetOrgId).populate('applications');
    //   if (!sourceOrg || !targetOrg) {
    //     return res.status(404).json({ success: false, message: 'Organizations not found' });
    //   }
    //   // Copy events from source to target
    //   const eventsToCopy = sourceOrg.applications.flatMap(app => app.events.map(e => e._id));
    //   targetOrg.applications[0].events.push(...eventsToCopy); // Assuming first application
    //   await targetOrg.save();
    //   res.status(200).json({ success: true, data: targetOrg });
    // } catch (error) {
    //   res.status(500).json({ success: false, error: error.message });
    // }


      res.status(200).json({ success: true, data: organization });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }
}
export default connectDB(handler); 