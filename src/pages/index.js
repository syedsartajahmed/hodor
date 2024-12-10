import { useState } from 'react';

export default function Home() {
    const [formData, setFormData] = useState({
        event_name: '',
        cta_text: '',
        cta_type: '',
        cta_color: '',
        cta_class: '',
        isSuperProperty: false, // Toggle for super property
    });

    const [generatedCode, setGeneratedCode] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const trackMixpanelEvent = (eventName, properties, isSuperProperty = false) => {
        let code = '';
        if (isSuperProperty) {
            code += `
            // Setting Super Properties
            mixpanel.register(${JSON.stringify(properties, null, 4)});\n\n`;
        }
        code += `
        // Tracking the Event
        mixpanel.track("${eventName}", ${JSON.stringify(properties, null, 4)});
        `;
        setGeneratedCode(code);
    };

    const generateCode = () => {
        const { event_name, cta_text, cta_type, cta_color, cta_class, isSuperProperty } = formData;

        // Validate inputs
        if (!event_name || !cta_text || !cta_type || !cta_color || !cta_class) {
            alert('Please fill in all fields.');
            return;
        }

        // Prepare properties
        const properties = {
            cta_text: cta_text.toLowerCase(),
            cta_type,
            cta_color,
            cta_class,
        };

        // Generate tracking code using the master function
        trackMixpanelEvent(event_name, properties, isSuperProperty);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-5">
            <div className="max-w-2xl mx-auto bg-white p-5 shadow-md rounded">
                <h1 className="text-2xl font-bold mb-4">Mixpanel Tracking Code Generator</h1>
                <div className="space-y-4">
                    <div>
                        <label className="block font-medium">Event Name:</label>
                        <input
                            type="text"
                            name="event_name"
                            value={formData.event_name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder="Enter Event Name (e.g., cta_clicked)"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">CTA Text:</label>
                        <input
                            type="text"
                            name="cta_text"
                            value={formData.cta_text}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder="Enter CTA Text (e.g., recharge_now)"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">CTA Type:</label>
                        <select
                            name="cta_type"
                            value={formData.cta_type}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select Type</option>
                            <option value="drawer">Drawer</option>
                            <option value="static">Static</option>
                            <option value="popup">Popup</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium">CTA Color:</label>
                        <select
                            name="cta_color"
                            value={formData.cta_color}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select Color</option>
                            <option value="red">Red</option>
                            <option value="green">Green</option>
                            <option value="blue">Blue</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium">CTA Class:</label>
                        <select
                            name="cta_class"
                            value={formData.cta_class}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select Class</option>
                            <option value="primary">Primary</option>
                            <option value="secondary">Secondary</option>
                            <option value="tertiary">Tertiary</option>
                        </select>
                    </div>
                    <div>
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                name="isSuperProperty"
                                checked={formData.isSuperProperty}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Set as Super Properties
                        </label>
                    </div>
                </div>
                <button
                    onClick={generateCode}
                    className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Generate Code
                </button>
                {generatedCode && (
                    <div className="mt-4 p-4 bg-gray-200 rounded">
                        <h2 className="font-medium mb-2">Generated Code:</h2>
                        <pre className="bg-gray-100 p-2 rounded overflow-auto">
                            <code>{generatedCode}</code>
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
