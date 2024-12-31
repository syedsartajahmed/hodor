
// Add this to your common file before calling Mixpanel init:
import mixpanel from 'mixpanel-browser';

// Initialize Mixpanel with tracking options
mixpanel.init('d46d915c637daa47331afa606e81f7d5', {
  debug: true,
  track_pageview: true,
});

// when a screen or a page is loaded
export function sceenLoaded(data) {
    mixpanel.register({
      "user_channel": data.user_channel
    });
    mixpanel.track("sceen_loaded", {
      "screen_name": data.screen_name // String
    });
}
  
// when user clicks on the events onn the hodor home
export function categoryClicked(data) {
    mixpanel.register({
      "user_channel": data.user_channel
    });
    mixpanel.track("category_clicked", {
      "category_count": data.category_count, // String,
      "category_name": data.category_name // String
    });
  }
  
  