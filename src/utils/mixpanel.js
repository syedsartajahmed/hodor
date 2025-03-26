// utils/mixpanel.js
import axios from 'axios';

// default
export async function cta_submit(distinct_id, properties) {
  try {
    const requests = [];

    
    // Track Event
    requests.push(axios.post('/api/mixpanel', {
      endpoint: 'track',
      data: [{
        event: "cta_submit",
        properties: {
          ...properties,
          distinct_id: distinct_id,
          $insert_id: `${distinct_id}-${Date.now()}`
        }
      }]
    }));

    
    // Super Properties
    requests.push(axios.post('/api/mixpanel', {
      endpoint: 'track',
      data: [{
        event: "$identify",
        properties: {
          ...properties,
          distinct_id: distinct_id,
          $set: {
            user_channel: properties.user_channel
          }
        }
      }]
    }));

    
    // User Properties
    requests.push(axios.post('/api/mixpanel', {
      endpoint: 'engage',
      data: [{
        $distinct_id: distinct_id,
        $set: {
          cta_text: properties.cta_text
        }
      }]
    }));

    const responses = await Promise.all(requests);
    return Promise.all(responses.map(r => r.data));
  } catch (error) {
    console.error('Tracking error:', error);
    throw new Error(`Tracking failed: ${error.message}`);
  }
}

// Example usage:
// cta_submit('user_123', {
//   cta_text: "example_cta_text",
//   user_channel: "example_user_channel",
// });

// default
export async function form_start(distinct_id, properties) {
  try {
    const requests = [];

    
    // Track Event
    requests.push(axios.post('/api/mixpanel', {
      endpoint: 'track',
      data: [{
        event: "form_start",
        properties: {
          token: '7d3cc272c44c84d80d671374397998cd',  // 🔥 Must include this!
      time: Date.now(), // Ensure timestamp is valid
      distinct_id: distinct_id,
      $insert_id: `${distinct_id}-${Date.now()}`,
      ...properties
        }
      }]
    }));

    
    // Super Properties
    requests.push(axios.post('/api/mixpanel', {
      endpoint: 'track',
      data: [{
        event: "$identify",
        properties: {
          token: '7d3cc272c44c84d80d671374397998cd',  // 🔥 Must include this!
          time: Date.now(), // Ensure timestamp is valid    
          distinct_id: distinct_id,
          $insert_id: `${distinct_id}-${Date.now()}`,
          $set: {
            user_channel: properties.user_channel
          },
          ...properties,

        }
      }]
    }));

    

    const responses = await Promise.all(requests);
    return Promise.all(responses.map(r => r.data));
  } catch (error) {
    console.error('Tracking error:', error);
    throw new Error(`Tracking failed: ${error.message}`);
  }
}

// Example usage:
// form_start('user_123', {
//   form_text: "Enter your name", "Provide email address",
//   user_channel: "example_user_channel",
// });

// Screen Load component
export async function screen_load(distinct_id, properties) {
  try {
    const requests = [];

    
    // Track Event
    requests.push(axios.post('/api/mixpanel', {
      endpoint: 'track',
      token: process.env.MIXPANEL_TOKEN, // Include token here
      data: [{
        event: "Screen_Load",
        properties: {
          ...properties,
          distinct_id: distinct_id,
          $insert_id: `${distinct_id}-${Date.now()}`
        }
      }]
    }));
    const responses = await Promise.all(requests);
    return Promise.all(responses.map(r => r.data));
  } catch (error) {
    console.error('Tracking error:', error);
    throw new Error(`Tracking failed: ${error.message}`);
  }
}

// Example usage:
// screen_load('user_123', {
//   Screen_Name: Header,
//   User_channel: web,
// });
