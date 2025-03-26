// pages/api/mixpanel.js
import axios from 'axios';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_BASE_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
      return res.status(200).end();
  }

  try {
    const { endpoint, data } = req.body;
  
    const response = await axios.post(`https://api.mixpanel.com/track`, 
      `data=${encodeURIComponent(JSON.stringify(data))}`,  // Encode payload
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // Correct format
          'Authorization': `Basic ${Buffer.from(`${process.env.MIXPANEL_SECRET}:`).toString("base64")}`
        }
      }
    );
    
    console.log(response.data);
    res.status(200).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const errorData = error.response?.data || { error: error.message };
    res.status(status).json(errorData);
  }
}
