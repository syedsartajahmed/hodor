import connectDB from "@/utils/mongoose";
import Organization from "@/models/organization";
import Application from "@/models/application";

async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { organizationId, ...applicationData } = req.body;

      // Find the organization
      const organization = await Organization.findById(organizationId).populate(
        "applications"
      );
      if (!organization) {
        return res
          .status(404)
          .json({ success: false, message: "Organization not found" });
      }

      // Find the existing "web" application
      const existingWebApp = organization.applications.find(
        (app) => app.type === "web"
      );

      if (!existingWebApp) {
        return res.status(404).json({
          success: false,
          message: "Web application not found in this organization.",
        });
      }

      // Update the existing "web" application
      const updatedApplication = await Application.findByIdAndUpdate(
        existingWebApp._id,
        { ...applicationData },
        { new: true } // Return the updated document
      );

      if (!updatedApplication) {
        return res
          .status(404)
          .json({
            success: false,
            message: "Failed to update web application.",
          });
      }

      res.status(200).json({ success: true, application: updatedApplication });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  } else if (req.method === "PUT") {
    try {
      const { applicationId, ...updateData } = req.body;

      // Find and update the existing application
      const updatedApplication = await Application.findByIdAndUpdate(
        applicationId,
        { ...updateData },
        { new: true }
      );

      if (!updatedApplication) {
        return res
          .status(404)
          .json({ success: false, message: "Application not found" });
      }

      res.status(200).json({ success: true, application: updatedApplication });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  } else {
    res
      .status(405)
      .json({ success: false, message: `Method ${req.method} not allowed` });
  }
}

export default connectDB(handler);
