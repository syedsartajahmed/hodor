import connectDB from "@/utils/mongoose";
import Organization from "@/models/organization";
import Application from "@/models/application";
import Event from "@/models/event"; 
import Item from "@/models/item"; 

async function handler(req, res) {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { organization_id } = req.query;

        if (organization_id) {
          // Fetch detailed data for a specific organization
          const organization = await Organization.findById(
            organization_id
          ).populate({
            path: "applications",
            model: "Application",
            populate: {
              path: "events",
              model: "Event",
              populate: {
                path: "items",
                model: "Item",
              },
            },
          });

          if (!organization) {
            return res
              .status(404)
              .json({ success: false, message: "Organization not found" });
          }

          return res.status(200).json(organization);
        } else {
          const organizations = await Organization.find(
            {},
            "name _id applications"
          );
          res.status(200).json(organizations);
        }
      } catch (error) {
        res
          .status(500)
          .json({
            success: false,
            message: "Server Error",
            error: error.message,
          });
      }
      break;

    case "POST":
      try {
        const { name } = req.body;
        console.log("Received POST request with body:", req.body);

        // Check if name is provided
        if (!name) {
          return res
            .status(400)
            .json({ success: false, message: "Name is required" });
        }

        // Create a new organization
        const newOrganization = await Organization.create({ name });

        // Create a default application for this organization
        const newApplication = await Application.create({
          type: "web",
          events: [], // Initialize with an empty array of events
        });

        // Update the organization with the created application's ID
        newOrganization.applications.push(newApplication._id);
        await newOrganization.save();

        // Return the organization and the newly created application
        res.status(201).json({
          organization: newOrganization,
          application: newApplication,
        });
      } catch (error) {
        if (error.code === 11000) {
          // Handle duplicate key error (unique name constraint)
          res
            .status(400)
            .json({
              success: false,
              message: "Organization name must be unique",
            });
        } else {
          res
            .status(500)
            .json({
              success: false,
              message: "Server Error",
              error: error.message,
            });
        }
      }
      break;

    case "DELETE":
      try {
        const { organization_id } = req.query;

        // Validate organization_id
        if (!organization_id) {
          return res
            .status(400)
            .json({ success: false, message: "Organization ID is required" });
        }

        // Find and delete the organization
        const organization = await Organization.findByIdAndDelete(
          organization_id
        );

        if (!organization) {
          return res
            .status(404)
            .json({ success: false, message: "Organization not found" });
        }

        // Delete associated applications and their events and items
        for (const appId of organization.applications) {
          const application = await Application.findByIdAndDelete(appId);
          if (application) {
            for (const eventId of application.events) {
              const event = await Event.findByIdAndDelete(eventId);
              if (event) {
                await Item.deleteMany({ _id: { $in: event.items } });
              }
            }
          }
        }

        return res
          .status(200)
          .json({
            success: true,
            message: "Organization and related data deleted successfully",
          });
      } catch (error) {
        console.error("Error deleting organization:", error);
        return res
          .status(500)
          .json({
            success: false,
            message: "Server Error",
            error: error.message,
          });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default connectDB(handler);
