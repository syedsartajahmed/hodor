import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { useRouter } from 'next/router';
import DrawerProperties from "./DrawerProperties";

const EventDrawer = () => {
  const { isEventDrawerOpen, toggleEventDrawer, selectedEvent,setAllEvents, currentOrganization, setTableData,setSelectedOrganization } = useAppContext();
  const router = useRouter();
  const { pathname } = router;
  const [formData, setFormData] = useState({
    cta_text: "",
    cta_type: "",
    cta_color: "",
    cta_class: "",
  });


  useEffect(() => {
    const propertyPairs = selectedEvent?.eventProperties?.split(', ') || [];
    const parsedProperties = {};
    
    propertyPairs.forEach(pair => {
      const [key, value] = pair.split(':');
      parsedProperties[key] = value;
    });

    setFormData({
      cta_text: parsedProperties.cta_text || "",
      cta_type: parsedProperties.cta_type || "",
      cta_color: parsedProperties.cta_color || "",
      cta_class: parsedProperties.cta_class || "",
    });
  
  }, [selectedEvent]);

  const [superProperty, setSuperProperty] = useState({
    name: "",
    value: ""
  });
  const [eventProperties, setEventProperties] = useState([{
    name: "",
    value: "",
    type: "String", // Default type
    propertyType: "Event Property", // Default type
    sampleValue: ""
  }]);

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

  const [loading, setLoading] = useState(false);
  const handleSave = async () => {
    setLoading(true);

    if (pathname === '/master-event' || pathname === '/dashboard/[id]/master-events') {
      const payload = {
        id: selectedEvent?._id,
        eventName: selectedEvent?.name || "Unnamed Event",
        event_definition: selectedEvent?.event_definition || "No description provided",
        platform: selectedEvent.platform || [],
        stakeholders: selectedEvent.stakeholders || [],
        category: selectedEvent.category || "Uncategorized",
        source: selectedEvent.source || [],
        action: selectedEvent.action || "No action",
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
        identify: selectedEvent.identify || false,
        unidentify: selectedEvent.unidentify || false,
        organization: selectedEvent.organization ,
      };
      
      console.log("Payload being sent:", payload);
      
      try {
        const response = await axios.post("/api/master-events", payload);
        const masterEventsDetails = response.data;      
        const totalEvents = masterEventsDetails.totalEvents || [];
        const updatedRows = totalEvents.map((event) => ({
        id: event._id,
        name: event.eventName,
          // eventProperties: event.items.map((item) => `${item.property}:${item.value}`).join(', '),
          eventProperties: event.items
          .map((item) => {
            // Format Event Properties
            const eventProps = item.event_property?.map((prop) =>
              `Property Name: ${prop.property_name || 'N/A'}, Value: ${
                prop.sample_value || 'N/A'
              }, Data Type: ${prop.data_type || 'N/A'}, Method Call: ${
                prop.method_call || 'N/A'
              }`
            ).join('; ') || '';
        
            // Format Super Properties
            const superProps = item.super_property?.map((prop) =>
              `Name: ${prop.name || 'N/A'}, Value: ${prop.value || 'N/A'}`
            ).join('; ') || '';
        
            // Format User Properties
            const userProps = item.user_property?.map((prop) =>
              `Name: ${prop.name || 'N/A'}, Value: ${prop.value || 'N/A'}`
            ).join('; ') || '';
        
            // Combine all properties into a single formatted string
            return [
              eventProps ? `Event Properties: { ${eventProps} }` : '',
              superProps ? `Super Properties: { ${superProps} }` : '',
              userProps ? `User Properties: { ${userProps} }` : '',
            ]
              .filter(Boolean)
              .join(', ');
          })
          .join('; '),
        stakeholders: event.stakeholders,
        category: event.category,
        source: event.source,
        action: event.action,
          platform: event.platform,
          ...event,
        }));
    
        setTableData(updatedRows);
        //setSelectedOrganization(organizationDetails);
        alert("Data saved successfully!");
      } catch (err) {
        // setError("Failed to save event data. Please try again.");
        console.error("Error saving event:", err.message);
      } finally {
        setLoading(false);
      }
    } else {
      if (!selectedEvent) {
        alert("No event data to save.");
        return;
      }
      const payload = {
        organization_id: currentOrganization?.id || null,
        application_id: currentOrganization?.applicationId || "default_application_id",
        eventName: selectedEvent?.name || "Unnamed Event",
        event_definition: selectedEvent?.event_definition || "No description provided",
        stakeholders: selectedEvent?.stakeholders || [],
        category: selectedEvent?.category || "Uncategorized",
        source: selectedEvent?.source || [],
        action: selectedEvent?.action || "No action",
        platform: selectedEvent?.platform || [],
        identify: selectedEvent?.identify || false,
        unidentify: selectedEvent?.unidentify || false,
        status: selectedEvent?.status || "not_started",
        items: [], // Include existing items
      };
      
      // Add or update user properties
      if (selectedEvent?.items?.[0]?.user_property?.length > 0) {
        const userPropertyItems = selectedEvent.items[0].user_property.map((userProperty) => ({
          user_property: [
            {
              name: userProperty?.name || null,
              value: userProperty?.value || null,
            },
          ],
        }));
      
        // Replace or add user property items
        payload.items = payload.items.filter((item) => !item.user_property); // Remove existing user_property items
        payload.items.push(...userPropertyItems);
      }
      
      // Add or update event properties
      if (selectedEvent?.items?.[0]?.event_property?.length > 0) {
        const eventPropertyItems = selectedEvent.items[0].event_property.map((eventProperty) => ({
          event_property: {
            property_name: eventProperty?.name || eventProperty?.property_name || null,
            sample_value: eventProperty?.sampleValue || eventProperty?.sample_value || null,
            data_type: eventProperty?.dataType || eventProperty?.data_type || null,
            property_type: eventProperty?.type || eventProperty?.property_type || null,
            property_definition: eventProperty?.description || eventProperty?.property_definition || null,
            method_call: eventProperty?.methodCall || eventProperty?.method_call || null,
          },
        }));
      
        // Replace or add event property items
        payload.items = payload.items.filter((item) => !item.event_property); // Remove existing event_property items
        payload.items.push(...eventPropertyItems);
      }
      
      // Add or update system (super) properties
      if (selectedEvent?.items?.[0]?.super_property?.length > 0) {
        const superPropertyItems = selectedEvent.items[0].super_property.map((superProperty) => ({
          super_property: [
            {
              name: superProperty?.name || null,
              value: superProperty?.value || null,
            },
          ],
        }));
      
        // Replace or add super property items
        payload.items = payload.items.filter((item) => !item.super_property); // Remove existing super_property items
        payload.items.push(...superPropertyItems);
      }
      
      // Include event ID for updates
      if (selectedEvent?._id) {
        payload.event_id = selectedEvent._id;
      }
      
      console.log("selectedEvent being sent:", selectedEvent);
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
        setAllEvents(events)
        const updatedRows = events.map((event) => ({
          id: event._id,
          name: event.eventName,
          // eventProperties: event.items.map((item) => `${item.property}:${item.value}`).join(', '),
          eventProperties: event.items
          .map((item) => {
            // Format Event Properties
            const eventProps = item.event_property?.map((prop) =>
              `Property Name: ${prop.property_name || 'N/A'}, Value: ${
                prop.sample_value || 'N/A'
              }, Data Type: ${prop.data_type || 'N/A'}, Method Call: ${
                prop.method_call || 'N/A'
              }`
            ).join('; ') || '';
        
            // Format Super Properties
            const superProps = item.super_property?.map((prop) =>
              `Name: ${prop.name || 'N/A'}, Value: ${prop.value || 'N/A'}`
            ).join('; ') || '';
        
            // Format User Properties
            const userProps = item.user_property?.map((prop) =>
              `Name: ${prop.name || 'N/A'}, Value: ${prop.value || 'N/A'}`
            ).join('; ') || '';
        
            // Combine all properties into a single formatted string
            return [
              eventProps ? `Event Properties: { ${eventProps} }` : '',
              superProps ? `Super Properties: { ${superProps} }` : '',
              userProps ? `User Properties: { ${userProps} }` : '',
            ]
              .filter(Boolean)
              .join(', ');
          })
          .join('; '),
          ...event,
        }));
        alert("Data saved successfully!");
        setTableData(updatedRows);
        setSelectedOrganization(organizationDetails);
      } catch (err) {
        // setError("Failed to save event data. Please try again.");
        console.error("Error saving event:", err.message);
      } finally {
        setLoading(false);
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
    const { name: superPropertyName, value: superPropertyValue } = superProperty;

    if (!superPropertyName || !superPropertyValue) {
      alert("Please provide a super property name and value.");
      return;
    }

    if (eventProperties.some(prop => !prop.name || !prop.value)) {
      alert("Please complete all event properties.");
      return;
    }

    const functionName = generateFunctionName(selectedEvent?.name || "Unnamed Event");

    const eventPropsCode = eventProperties.map(prop => `		"${prop.name}": product.${prop.name}, // data type:${prop.type}, property_type: ${prop.propertyType}, sample value: ${prop.sampleValue}`).join(",\n");

    const code = `
// Initiated when a user starts the ${selectedEvent?.name || "event"} process
function ${functionName}(product) {
	mixpanel.track("${selectedEvent?.name || "event"}_triggered", {
${eventPropsCode}
	});

	mixpanel.people.set({
		"${superPropertyName}": product.${superPropertyName} // data type:Incremental, property_type: User Property, sample value: ${superPropertyValue}
	});
}
    `;
    setGeneratedCode(code);
  };


    const generateCodeSecond = () => {
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
{
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
      className={`fixed top-0 right-0 h-full  w-120 bg-gray-100 shadow-lg transform transition-transform duration-300 z-50 ${
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
       
            </div>
          <div className="mt-3">
            </div>
          {/* DrawerProperties Component */}
          <div className="mt-6">
            <DrawerProperties />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-row items-center mx-5">
          <div className="flex-1">
          </div>
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
