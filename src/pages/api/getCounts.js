import connectDB from "@/utils/mongoose";
import Organization from "@/models/organization";
import Event from "@/models/event";

async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Fetch total organizations
      const totalOrganizations = await Organization.countDocuments();

      // Fetch a fixed number of events (10 as of now)
        const events = await Event.find();

      res.status(200).json({
        totalOrganizations,
        events: events.length,  // Count of the 10 events fetched
      });
    } catch (error) {
      console.error("Error fetching counts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}

export default connectDB(handler);
