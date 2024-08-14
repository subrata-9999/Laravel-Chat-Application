/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

import Echo from 'laravel-echo';

import Pusher from 'pusher-js';
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
    wsHost: import.meta.env.VITE_PUSHER_HOST ? import.meta.env.VITE_PUSHER_HOST : `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
    wsPort: import.meta.env.VITE_PUSHER_PORT ?? 80,
    wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});


// Test Echo connection
// window.Echo.connector.pusher.connection.bind('connected', function() {
//     console.log('Connected to Pusher!');
// });

// window.Echo.connector.pusher.connection.bind('error', function(error) {
//     console.error('Pusher Error:', error);
// });

// window.Echo.connector.pusher.connection.bind('failed', function() {
//     console.error('Failed to connect to Pusher.');
// });

// Listen for status update events
window.Echo.join("status-update")
    .here((users) => {
        console.log("Users here:", users);
        for (let i = 0; i < users.length; i++) {
            if (users[i].id != sender_id) {
                $("#" + users[i].id + "-status")
                    .removeClass("offline_status")
                    .addClass("online_status")
                    .text("Online");
            }
        }
    })
    .joining((user) => {
        console.log("User joined:", user);
        $("#" + user.id + "-status")
            .removeClass("offline_status")
            .addClass("online_status")
            .text("Online");
    })
    .leaving((user) => {
        console.log("User left:", user);
        $("#" + user.id + "-status")
            .removeClass("online_status")
            .addClass("offline_status")
            .text("Offline");
    })
    .listen("UserStatusEvent", (e) => {
        console.log("Status updated:", e);
    });


// Message send event
window.Echo.private("Message-send").listen(".message.sent", (e) => {
    console.log("New message. From "+e.chat.sender_id+" to "+e.chat.receiver_id, e);
    if (e.chat.receiver_id == sender_id && e.chat.sender_id == receiver_id) {
        let chatMessage = e.chat.message;
        let message_id = e.chat.id;
        let message_sender_id = e.chat.sender_id;
        let message_receiver_id = e.chat.receiver_id;
        let message_created_at = e.chat.created_at;

        // Convert created_at to a Date object
        let date = new Date(message_created_at);

        // Format the date to IST (if needed for internal purposes but not displayed)
        let options = {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Kolkata'
        };
        let formattedDate = date.toLocaleString('en-GB', options);

        let chatMessageHtml = `<div class="chat_message_item chat_message_item_incoming"
                                   data-id="${message_id}"
                                   data-sender-id="${message_sender_id}"
                                   data-receiver-id="${message_receiver_id}"
                                   data-created-at="${formattedDate}">
                                    <div class="chat_message_content">
                                        <p>${chatMessage}</p>
                                    </div>
                                </div>`;

        $("#chat_area_messages").append(chatMessageHtml);
        scrollChatAreaToBottom();
    }

});
