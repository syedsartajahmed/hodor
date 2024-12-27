import connectDB from "@/utils/mongoose";
import Organization from "@/models/organization";
import MasterEvent from "@/models/masterEvents";

async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache'); 
  res.setHeader('Expires', '0');
  
  if (req.method === "GET") {
    try {
        const totalOrganizations = await Organization.countDocuments();
        const totalMasterEvents  = await MasterEvent.countDocuments();

      res.status(200).json({
        totalOrganizations,
        events: totalMasterEvents ,  
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
