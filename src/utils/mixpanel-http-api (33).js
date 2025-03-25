import axios from 'axios';

// HTTP API Documentation:
// https://developer.mixpanel.com/reference/import-events
// https://developer.mixpanel.com/reference/profile-set

// default
export async function cta_submit(distinct_id, properties) {
  try {
    const requests = [];

    // Track Event
    
    requests.push(axios({
      method: 'POST',
      url: 'https://api.mixpanel.com/track',
      headers: { 'Content-Type': 'application/json' },
      data: [{
        event: "cta_submit",
        properties: {
          ...properties,
          token: "undefined",
          distinct_id: distinct_id,
          $insert_id: `${distinct_id}-${Date.now()}`
        }
      }]
    }));

    // Super Properties
    
    requests.push(axios({
      method: 'POST',
      url: 'https://api.mixpanel.com/track',
      headers: { 'Content-Type': 'application/json' },
      data: [{
        event: "$identify",
        properties: {
          ...properties,
          token: "undefined",
          distinct_id: distinct_id,
          $set: {
            user_channel: properties.user_channel
          }
        }
      }]
    }));

    // User Properties
    
    requests.push(axios({
      method: 'POST',
      url: 'https://api.mixpanel.com/engage',
      headers: { 'Content-Type': 'application/json' },
      data: [{
        $token: "undefined",
        $distinct_id: distinct_id,
        $set: {
          cta_text: properties.cta_text
        }
      }]
    }));

    const responses = await Promise.all(requests);
    return responses.map(r => r.data);
    
  } catch (error) {
    console.error('Mixpanel API error:', error.response?.data || error.message);
    throw error;
  }
}

// Example invocation
// cta_submit('user_123', {
//   cta_text: "example_cta_text",
//   user_channel: "example_user_channel",
// });

// default
export async function form_start(distinct_id, properties) {
  try {
    const requests = [];

    // Track Event
    
    requests.push(axios({
      method: 'POST',
      url: 'https://api.mixpanel.com/track',
      headers: { 'Content-Type': 'application/json' },
      data: [{
        event: "form_start",
        properties: {
          ...properties,
          token: "undefined",
          distinct_id: distinct_id,
          $insert_id: `${distinct_id}-${Date.now()}`
        }
      }]
    }));

    // Super Properties
    
    requests.push(axios({
      method: 'POST',
      url: 'https://api.mixpanel.com/track',
      headers: { 'Content-Type': 'application/json' },
      data: [{
        event: "$identify",
        properties: {
          ...properties,
          token: "undefined",
          distinct_id: distinct_id,
          $set: {
            user_channel: properties.user_channel
          }
        }
      }]
    }));

    // User Properties
    

    const responses = await Promise.all(requests);
    return responses.map(r => r.data);
    
  } catch (error) {
    console.error('Mixpanel API error:', error.response?.data || error.message);
    throw error;
  }
}

// Example invocation
// form_start('user_123', {
//   form_text: "Enter your name", "Provide email address",
//   user_channel: "example_user_channel",
// });

// Screen Load component
export async function screen_load(distinct_id, properties) {
  try {
    const requests = [];

    // Track Event
    
    requests.push(axios({
      method: 'POST',
      url: 'https://api.mixpanel.com/track',
      headers: { 'Content-Type': 'application/json' },
      data: [{
        event: "Screen_Load",
        properties: {
          ...properties,
          token: "7d3cc272c44c84d80d671374397998cd",
          distinct_id: distinct_id,
          $insert_id: `${distinct_id}-${Date.now()}`
        }
      }]
    }));
 
    // Super Properties
    

    // User Properties
    

    const responses = await Promise.all(requests);
    return responses.map(r => r.data);
    
  } catch (error) {
    console.error('Mixpanel API error:', error.response?.data || error.message);
    throw error;
  }
}

// Example invocation
// screen_load('user_123', {
//   Screen_Name: Header,
//   User_channel: web,
// });
