import mixpanel from 'mixpanel';

// Initialize Mixpanel
const mixpanelClient = mixpanel.init('YOUR_MIXPANEL_TOKEN');

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { eventName, properties, isSuperProperty } = req.body;

        if (!eventName || !properties) {
            return res.status(400).json({ error: 'Event name and properties are required.' });
        }

        try {
            if (isSuperProperty) {
                mixpanelClient.people.set(properties); // Set super properties
                console.log('Super properties set:', properties);
            }

            mixpanelClient.track(eventName, properties); // Track event
            console.log(`Event "${eventName}" tracked with properties:`, properties);

            return res.status(200).json({ message: 'Event tracked successfully!' });
        } catch (error) {
            console.error('Error tracking event:', error);
            return res.status(500).json({ error: 'Failed to track event' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
