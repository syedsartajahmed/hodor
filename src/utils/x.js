
// Step 1: 
//     # Installation Instructions
//     # via npm
//     npm install --save mixpanel-browser

//     # via yarn
//     yarn add mixpanel - browser
    

// Step 2:
//     //create a new file for adding mixpanel

// Step 3:
//     // Add this to your common file before calling Mixpanel init:
//     import mixpanel from 'mixpanel-browser';

//     // Initialize Mixpanel with tracking options
//     mixpanel.init('d46d915c637daa47331afa606e81f7d5', {
//     debug: true,
//     track_pageview: true,
//     });

// Step 4: 
//     //paste all the events code into one single file
//     // when user clicks on the events onn the hodor home
//     export function categoryClicked(data) {
//         mixpanel.register({
//         "user_channel": data.user_channel
//         });
//         mixpanel.track("category_clicked", {
//         "category_count": data.category_count, // String,
//         "category_name": data.category_name // String
//         });
//     }
        
//     // when a screen or a page is loaded
//     export function sceenLoaded(data) {
//         mixpanel.register({
//         "user_channel": data.user_channel
//         });
//         mixpanel.track("sceen_loaded", {
//         "screen_name": data.screen_name // String
//         });
//     }
    

// Step 5:
//     //Use this import statement to invoke the generated function
//     master-event.js : import { sceenLoaded } from '../../../utils/mixpanel';
//     organizations.js: import { sceenLoaded } from '../utils/mixpanel';
//     welcome.js : import { sceenLoaded, categoryClicked  } from '../utils/mixpanel';

    
// Step 6:
// //Call this function where you want to trigger Mixpanel tracking.
//     welcome: 3
//     organizations: 1
//     master-event: 1
    
//     categoryClicked({
//         category_count: "value of the events or org",
//         ategory_name: "value s eveent or organisation", 
//         user_channel: "web" 
//     });

//     sceenLoaded({
//         screen_name: "home", 
//         user_channel: "web" 
//     });

// //
// categoryClicked({
//     category_count: counts.events || 0, 
//     category_name: "master-events",
//     user_channel: "web" 
// });
// categoryClicked({
//     category_count: counts.totalOrganizations || 0,
//     category_name: "organization", 
//     user_channel: "web" 
// });
// sceenLoaded({
//     screen_name: "home", 
//     user_channel: "web" 
// });
// sceenLoaded({
//     screen_name: "home", 
//     user_channel: "web" 
// });            
// sceenLoaded({
//     screen_name: "events", 
//     user_channel: "web" 
// });

// Improvments:
//     *) create a master file with step2, setp3, step4
//     *) create a import functions with all events jst to make easy copy paste
