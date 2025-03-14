import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import axios from "axios";
import { useRouter } from "next/router";
import DrawerProperties from "./DrawerProperties";
import showToast from "@/utils/toast";
import { eventDrawerState, organizationState,isProductAnalystState } from "@/recoil/atom";
import { selectedEventState } from "@/recoil/atom"; // Import the selectedEventState atom

const EventDrawer = ({ isShowSave = true }) => {
  const [selectedEvent, setSelectedEvent] = useRecoilState(selectedEventState); // Use selectedEventState
  const [drawerState, setDrawerState] = useRecoilState(eventDrawerState);
  const [organizationData, setOrganizationData] = useRecoilState(organizationState);
  const [isProductAnalyst, setIsProductAnalyst] = useRecoilState(isProductAnalystState);
  const router = useRouter();
  const { pathname } = router;

  const [formData, setFormData] = useState({
    cta_text: "",
    cta_type: "",
    cta_color: "",
    cta_class: "",
  });

  useEffect(() => {
    console.log("isProductAnalyst updated:", drawerState.isProductAnalyst);
  }, [drawerState.isProductAnalyst]);

  useEffect(() => {
    const propertyPairs = selectedEvent?.eventProperties?.split(", ") || []; // Use selectedEvent
    const parsedProperties = {};

    propertyPairs.forEach((pair) => {
      const [key, value] = pair.split(":");
      parsedProperties[key] = value;
    });

    setFormData({
      cta_text: parsedProperties.cta_text || "",
      cta_type: parsedProperties.cta_type || "",
      cta_color: parsedProperties.cta_color || "",
      cta_class: parsedProperties.cta_class || "",
    });
  }, [selectedEvent]); // Use selectedEvent

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    setLoading(true);

    // Check if selectedEvent is defined
    if (!selectedEvent) {
      showToast("No event data to save.");
      setLoading(false);
      return;
    }

    console.log("Selected Event:", selectedEvent); // Debugging

    if (pathname === "/master-event" || pathname === "/dashboard/[id]/master-events") {
      const payload = {
        id: selectedEvent?._id,
        eventName: selectedEvent?.name || "Unnamed Event",
        event_definition: selectedEvent?.event_definition || "No description provided",
        platform: selectedEvent?.platform || [],
        stakeholders: selectedEvent?.stakeholders || [],
        category: selectedEvent?.category || "Uncategorized",
        source: selectedEvent?.source || [],
        action: selectedEvent?.action || "No action",
        items: selectedEvent?.items?.map((item) => ({
          user_property: item.user_property || [],
          event_property: item.event_property?.map((prop) => ({
            property_name: prop.property_name || prop.name,
            sample_value: prop.sample_value || prop.value,
            data_type: prop.data_type || prop.type,
            property_type: prop.property_type,
            property_definition: prop.property_definition || "Event property definition",
            method_call: prop.method_call || "Track",
          })) || [],
          super_property: item.super_property || [],
        })) || [],
        identify: selectedEvent?.identify || false,
        unidentify: selectedEvent?.unidentify || false,
        organization: selectedEvent?.organization,
      };

      try {
        const response = await axios.post("/api/master-events", payload);
        const masterEventsDetails = response.data;
        const totalEvents = masterEventsDetails.totalEvents || [];
        const updatedRows = totalEvents.map((event) => ({
          id: event._id,
          name: event.eventName,
          eventProperties: event.items
            .map((item) => {
              const eventProps = item.event_property
                ?.map(
                  (prop) =>
                    `Property Name: ${prop.property_name || "N/A"}, Value: ${prop.sample_value || "N/A"}, Data Type: ${prop.data_type || "N/A"}, Method Call: ${prop.method_call || "N/A"}`
                )
                .join("; ") || "";

              const superProps = item.super_property
                ?.map(
                  (prop) =>
                    `Name: ${prop.name || "N/A"}, Value: ${prop.value || "N/A"}`
                )
                .join("; ") || "";

              const userProps = item.user_property
                ?.map(
                  (prop) =>
                    `Name: ${prop.name || "N/A"}, Value: ${prop.value || "N/A"}`
                )
                .join("; ") || "";

              return [
                eventProps ? `Event Properties: { ${eventProps} }` : "",
                superProps ? `Super Properties: { ${superProps} }` : "",
                userProps ? `User Properties: { ${userProps} }` : "",
              ]
                .filter(Boolean)
                .join(", ");
            })
            .join("; "),
          stakeholders: event.stakeholders,
          category: event.category,
          source: event.source,
          action: event.action,
          platform: event.platform,
          ...event,
        }));

        setOrganizationData((prev) => ({ ...prev, allEvents: updatedRows }));
        showToast("Data saved successfully!");
      } catch (error) {
        console.error("Error saving event:", error.message);
        if (error.response && error.response.status === 409) {
          showToast(error.response.data.message);
        } else {
          showToast("An unexpected error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      if (!selectedEvent) {
        showToast("No event data to save.");
        return;
      }
      const payload = {
        organization_id: organizationData.currentOrganization?.id || null,
        application_id: organizationData.currentOrganization?.applicationId || "default_application_id",
        eventName: selectedEvent?.name || "Unnamed Event",
        event_definition: selectedEvent?.event_definition || "No description provided",
        stakeholders: selectedEvent?.stakeholders || [],
        category: selectedEvent?.category || "Uncategorized",
        source: selectedEvent?.source || [],
        action: selectedEvent?.action || "No action",
        platform: selectedEvent?.platform || [],
        identify: selectedEvent?.identify || false,
        unidentify: selectedEvent?.unidentify || false,
        status: selectedEvent?.status || "not started",
        items: [],
      };

      // Add or update user properties
      if (selectedEvent?.items?.[0]?.user_property?.length > 0) {
        const userPropertyItems = selectedEvent.items[0].user_property.map(
          (userProperty) => ({
            user_property: [
              {
                name: userProperty?.name || null,
                value: userProperty?.value || null,
                property_definition: userProperty?.property_definition || null,
                data_type: userProperty?.data_type || null,
              },
            ],
          })
        );

        payload.items = payload.items.filter((item) => !item.user_property);
        payload.items.push(...userPropertyItems);
      }

      // Add or update event properties
      if (selectedEvent?.items?.[0]?.event_property?.length > 0) {
        const eventPropertyItems = selectedEvent.items[0].event_property.map(
          (eventProperty) => ({
            event_property: {
              property_name: eventProperty?.name || eventProperty?.property_name || null,
              sample_value: eventProperty?.sample_value || null,
              data_type: eventProperty?.dataType || eventProperty?.data_type || null,
              property_type: eventProperty?.type || eventProperty?.property_type || null,
              property_definition: eventProperty?.description || eventProperty?.property_definition || null,
              method_call: eventProperty?.methodCall || eventProperty?.method_call || null,
            },
          })
        );

        payload.items = payload.items.filter((item) => !item.event_property);
        payload.items.push(...eventPropertyItems);
      }

      // Add or update system (super) properties
      if (selectedEvent?.items?.[0]?.super_property?.length > 0) {
        const superPropertyItems = selectedEvent.items[0].super_property.map(
          (superProperty) => ({
            super_property: [
              {
                name: superProperty?.name || null,
                value: superProperty?.value || null,
                property_definition: superProperty?.property_definition || null,
                data_type: superProperty?.data_type || null,
              },
            ],
          })
        );

        payload.items = payload.items.filter((item) => !item.super_property);
        payload.items.push(...superPropertyItems);
      }

      if (selectedEvent?._id) {
        payload.event_id = selectedEvent._id;
      }

      try {
        const saveResponse = await axios.post("/api/save", payload);
        const response = await axios.get(
          `/api/organizations?organization_id=${organizationData.currentOrganization.id}`
        );
        const organizationDetails = response.data;
        const events = organizationDetails.applications?.[0]?.events || [];
        setOrganizationData((prev) => ({ ...prev, allEvents: events }));
        showToast("Data saved successfully!");
      } catch (error) {
        console.error("Error saving event:", error.message);
        if (error.response && error.response.status === 409) {
          showToast(error.response.data.message);
        } else {
          showToast("An unexpected error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggle = () => {
    const newValue = !drawerState.isProductAnalyst;
    setIsProductAnalyst(newValue); // Update the global state
    setDrawerState((prev) => ({ ...prev, isProductAnalyst: newValue })); // Update the drawer state
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-120 bg-gray-100 shadow-lg transform transition-transform duration-300 z-50 ${
        drawerState.isEventDrawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{
        zIndex: 1100,
      }}
    >
      <div className="flex flex-col h-full relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {selectedEvent?.name || "Event Details"} {/* Use selectedEvent */}
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-base font-bold">
              {drawerState.isProductAnalyst ? "Product Analyst" : "CDP"}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={drawerState.isProductAnalyst}
                onChange={handleToggle}
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-[#2d2d2d] peer focus:outline-none peer-focus:ring-2 peer-focus:ring-[#2d2d2d] transition"></div>
              <span className="absolute left-1 top-1 w-4 h-4 bg-white border border-gray-300 rounded-full peer-checked:translate-x-5 peer-checked:border-white transition-transform"></span>
            </label>
          </div>

          <button
            onClick={() => setDrawerState((prev) => ({ ...prev, isEventDrawerOpen: false }))}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 relative scrollbar-hidden">
          <div className="space-y-4"></div>
          <div className="mt-3"></div>
          {/* DrawerProperties Component */}
          <div className="">
            <DrawerProperties />
          </div>
        </div>

        {isShowSave && (
          <div>
            <div className="flex flex-row items-center mx-5">
              <div className="flex-1"></div>
              <div className="p-4 border-t flex items-center gap-7 justify-center">
                <button
                  onClick={handleSave}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-600 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 flex items-center justify-center"
                  disabled={loading} // Disable button when loading
                >
                  {loading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                      ></path>
                    </svg>
                  ) : (
                    "Save"
                  )}
                </button>

                <button
                  onClick={() => setDrawerState((prev) => ({ ...prev, isEventDrawerOpen: false }))}
                  className="text-gray-500 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Footer */}
      </div>
    </div>
  );
};

export default EventDrawer;