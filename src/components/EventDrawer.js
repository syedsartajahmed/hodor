import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { useRouter } from 'next/router';
import DrawerProperties from "./DrawerProperties";

const EventDrawer = () => {
  const { isEventDrawerOpen, toggleEventDrawer, selectedEvent, currentOrganization, setTableData,setSelectedOrganization } = useAppContext();
  const router = useRouter();
  const { pathname } = router;
  const [formData, setFormData] = useState({
    cta_text: "",
    cta_type: "",
    cta_color: "",
    cta_class: "",
  });

  const [superProperty, setSuperProperty] = useState({
    name: "",
    value: ""
  });
  const [generatedCode, setGeneratedCode] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validRequest = () => {
    const { cta_text, cta_type, cta_color, cta_class } = formData;
    if (!cta_text || !cta_type || !cta_color || !cta_class) return false;
    return true;
  };


  const handleSave = async () => {
    const { cta_text, cta_type, cta_color, cta_class } = formData;

    if (!cta_text || !cta_type || !cta_color || !cta_class) {
      alert("Please fill in all fields to save.");
      return;
    }
  
    if (pathname === '/master-event') { 
      const payload = {
        eventName: selectedEvent?.name || "Unnamed Event", 
        event_definition: selectedEvent?.description || "description",
        items: [
          {
            property_name: "cta_text",
            sample_value: cta_text,
            data_type: "string",
            property_type: "track",
            property_definition: "property definition",
            method_call: "method call",
          },
          {
            property_name: "cta_type",
            sample_value: cta_type,
            data_type: "string",
            property_type: "track",
            property_definition: "property definition",
            method_call: "method call",
          },
          {
            property_name: "cta_color",
            sample_value: cta_color,
            data_type: "string",
            property_type: "track",
            property_definition: "property definition",
            method_call: "method call",
          },
          {
            property_name: "cta_class",
            sample_value: cta_class,
            data_type: "string",
            property_type: "track",
            property_definition: "property definition",
            method_call: "method call",
          },
        ],
        
        stakeholders: "Marketing Team", 
        category: "CTA Category", 
        source: "Web App", 
        action: "CTA Clicked", 
        platform: "Web",
      };
      
      try {
        const response = await axios.post("/api/master-events", payload);
        const masterEventsDetails = response.data;      
        const totalEvents = masterEventsDetails.totalEvents || [];
        const updatedRows = totalEvents.map((event) => ({
        id: event._id,
        name: event.eventName,
        eventProperties: event.items.map((item) => `${item.property}:${item.value}`).join(', '),
        stakeholders: event.stakeholders,
        category: event.category,
        source: event.source,
        action: event.action,
        platform : event.platform,
        }));
    
        setTableData(updatedRows);
        setSelectedOrganization(organizationDetails);
      } catch (err) {
        // setError("Failed to save event data. Please try again.");
        console.error("Error saving event:", err.message);
      } finally {
        // setLoading(false);
      }
    } else {
      const payload = {
        organization_id: currentOrganization.id, 
        organization_name: currentOrganization.name,
        application_id: currentOrganization.applicationId || "default_application_id", 
        eventName: selectedEvent?.name || "Unnamed Event", 
        event_definition: selectedEvent?.description || "description",
        items: [
          {
            property_name: "cta_text",
            sample_value: cta_text,
            data_type: "string",
            property_type: "track",
            property_definition: "property definition",
            method_call: "method call",
          },
          {
            property_name: "cta_type",
            sample_value: cta_type,
            data_type: "string",
            property_type: "track",
            property_definition: "property definition",
            method_call: "method call",
          },
          {
            property_name: "cta_color",
            sample_value: cta_color,
            data_type: "string",
            property_type: "track",
            property_definition: "property definition",
            method_call: "method call",
          },
          {
            property_name: "cta_class",
            sample_value: cta_class,
            data_type: "string",
            property_type: "track",
            property_definition: "property definition",
            method_call: "method call",
          },
        ],
        stakeholders: "Marketing Team", 
        category: "CTA Tracking", 
        source: "Web App", 
        action: "CTA Clicked", 
        platform: "Web",
      };

      if (selectedEvent?._id) {
        payload.event_id = selectedEvent._id;
      }
    
      console.log("Payload being sent:", payload);
  
      try {
        // setLoading(true);
        // setError(null);
        // setSuccessMessage(null);
    
        // Send POST request to save data
        const saveResponse = await axios.post("/api/save", payload);
        const response = await axios.get(`/api/organizations?organization_id=${currentOrganization.id}`);
        const organizationDetails = response.data;  
        const events = organizationDetails.applications?.[0]?.events || [];
        const updatedRows = events.map((event) => ({
          id: event._id,
          name: event.eventName,
          eventProperties: event.items.map((item) => `${item.property}:${item.value}`).join(', '),
          ...event,
        }));
  
        setTableData(updatedRows);
        setSelectedOrganization(organizationDetails);
      } catch (err) {
        // setError("Failed to save event data. Please try again.");
        console.error("Error saving event:", err.message);
      } finally {
        // setLoading(false);
      }
    }
  
    
  };
   const generateFunctionName = (eventName) => {
    return eventName.trim().toLowerCase().replace(/\s+/g, '_') + '_event';
  };
  const handleSuperPropertyChange = (e) => {
    const { name, value } = e.target;
    setSuperProperty({
      ...superProperty,
      [name]: value,
    });
  };

  const generateCode = () => {
    const { cta_text, cta_type, cta_color, cta_class } = formData;
    const { name: superPropertyName, value: superPropertyValue } = superProperty;

    if (!validRequest()) {
      alert("Please fill in all fields to generate the code.");
      return;
    }

    if (!superPropertyName || !superPropertyValue) {
      alert("Please provide a super property name and value.");
      return;
    }

    const functionName = generateFunctionName(selectedEvent?.name || "Unnamed Event");

    const code = `
function ${functionName}() {
  mixpanel.register({
    ${JSON.stringify(superPropertyName)}: ${JSON.stringify(superPropertyValue)}
  });

  mixpanel.track("${selectedEvent?.name}", {
    cta_text: "${cta_text.toLowerCase()}",
    cta_type: "${cta_type}",
    cta_color: "${cta_color}",
    cta_class: "${cta_class}"
  });
}
    `;
    setGeneratedCode(code);
  };
    
   

  return (
    <div
      className={`fixed top-0 right-0 h-full  w-120 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        isEventDrawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{
        zIndex: 1100,
      }}
    >
      <div className="flex flex-col h-full relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {selectedEvent?.name || "Event Details"}
          </h2>
          <button
            onClick={() => toggleEventDrawer(false)}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 relative scrollbar-hidden">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                CTA Text
              </label>
              <input
                type="text"
                name="cta_text"
                value={formData.cta_text}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter CTA text (e.g., recharge_now)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                CTA Type
              </label>
              <select
                name="cta_type"
                value={formData.cta_type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Type</option>
                <option value="drawer">Drawer</option>
                <option value="static">Static</option>
                <option value="popup">Popup</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                CTA Color
              </label>
              <select
                name="cta_color"
                value={formData.cta_color}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Color</option>
                <option value="red">Red</option>
                <option value="green">Green</option>
                <option value="blue">Blue</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                CTA Class
              </label>
              <select
                name="cta_class"
                value={formData.cta_class}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Class</option>
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="tertiary">Tertiary</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700">
                Super Property Name
              </label>
              <input
                type="text"
                name="name"
                value={superProperty.name}
                onChange={handleSuperPropertyChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter Super Property Name"
              />
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700">
                Super Property Value
              </label>
              <input
                type="text"
                name="value"
                value={superProperty.value}
                onChange={handleSuperPropertyChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter Super Property Value"
              />
            </div>
          


          {generatedCode && (
            <div className="mt-6 p-4 bg-gray-100 rounded-md">
              <h3 className="text-sm font-semibold mb-2">Generated Code:</h3>
              <pre className="text-sm bg-gray-200 p-2 rounded-md overflow-x-auto">
                {generatedCode}
              </pre>
            </div>
          )}

          {/* DrawerProperties Component */}
          <div className="mt-6">
            <DrawerProperties />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-row items-center mx-5">
          <div className="flex-1">
            <button
              onClick={generateCode}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-600 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
            >
              Generate Code
            </button>
          </div>
          <div className="p-4 border-t flex items-center gap-7 justify-center">
            <button
              onClick={handleSave}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-600 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
            >
              Save
            </button>
            <button
              onClick={() => toggleEventDrawer(false)}
              className="text-gray-500 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDrawer;
