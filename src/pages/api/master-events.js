import connectDB from "@/utils/mongoose";
import MasterEvent from "@/models/masterEvents";

async function handler(req, res) {
    if (req.method === "GET") {
        try {
        const totalEvents = await MasterEvent.find().populate('items');
        res.status(200).json({
        totalEvents,
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
