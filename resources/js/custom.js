import Echo from "laravel-echo";
import Pusher from "pusher-js";
// import { loadConfigFromFile } from "vite";

// Configure Laravel Echo and Pusher

window.Pusher = Pusher;
window.Echo = new Echo({
    broadcaster: "pusher",
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    encrypted: false,
    host: window.location.hostname + ':6001',
    // forceTLS: false,
    debug: true, // Enable debug mode
    disableStats: true, // Disable stats
});


$(document).ready(function () {
    // Set up AJAX
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    function handleResize() {
        if ($(window).width() < 900) {
            if (receiver_id) {
                $(".chat_outerarea").show();
                $(".chatlist_outerarea").hide();
            }else{
                $(".chat_outerarea").hide();
                $(".chatlist_outerarea").show();
            }
            $(".chat_outerarea_pre").hide();
            $(".back_to_list").show();
        } else {
            $(".chatlist_outerarea").show();
            if (receiver_id) {
                $(".chat_outerarea").show();
            }else{
                $(".chat_outerarea_pre").show();
            }
            $(".back_to_list").hide();
        }
    }

    handleResize();


    // Add event listener to all chat list items
    $(".chatlist_item").on("click", function () {

        if ($(window).width() < 900) {
            $(".chatlist_outerarea").hide();
            $(".back_to_list").show();
        }

        // Empty chat area messages
        $("#chat_area_messages").empty();
        // Hide all elements with class 'chat_outerarea_pre'
        $(".chat_outerarea_pre").hide();

        // Show all elements with class 'chat_outerarea'
        $(".chat_outerarea").show();

        // Get data attributes from the clicked item
        const userId = $(this).data("id");
        const userName = $(this).data("name");
        const userImage = $(this).data("image");
        //adding emoji
        const userInfo = `<i class="fa-solid fa-ellipsis-vertical"></i>`;

        // Update chat area with selected user's details
        $("#chatPersonImage").attr("src", userImage);
        $("#chatPersonName").text(userName);
        $("#chatPersonInfo").html(userInfo);
        receiver_id = userId;

        console.log("sender user id:", sender_id);
        console.log("receiver user id:", receiver_id);

        // Fetch chat messages
        loadChatMessages(sender_id, receiver_id);
        scrollChatAreaToBottom();
    });

    // Save chat message
    $("#chat-form").on("submit", function (e) {
        e.preventDefault();

        let message = $("#chat_message_input").val();

        $.ajax({
            url: "/save-chat",
            type: "POST",
            data: {
                sender_id: sender_id,
                receiver_id: receiver_id,
                message: message,
            },
            success: function (response) {
                if (response.status == "success") {
                    $("#chat_message_input").val(""); // Clear the input field

                    let chatMessage = response.data.message;
                    let message_id = response.data.id;
                    let message_sender_id = response.data.sender_id;
                    let message_receiver_id = response.data.receiver_id;
                    let message_created_at = response.data.created_at;

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

                    let chatMessageHtml = `<div class="chat_message_item chat_message_item_outgoing"
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
                 else {
                    console.log(response);
                }
                // console.log(response);
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", status, error);
            },
        });
    });

    $(window).resize(function () {
        handleResize();
        scrollChatAreaToBottom()
    });
});


// Fetch chat messages
function loadChatMessages(sender_id, receiver_id) {
    $.ajax({
        url: "/load-chat",
        type: "POST",
        data: {
            sender_id: sender_id,
            receiver_id: receiver_id,
        },
        success: function (response) {
            if (response.status == "success") {
                let chatMessages = response.data;
                let chatMessagesHtml = "";

                for (let i = 0; i < chatMessages.length; i++) {
                    let chatMessage = chatMessages[i].message;
                    let message_id = chatMessages[i].id;
                    let message_sender_id = chatMessages[i].sender_id;
                    let message_receiver_id = chatMessages[i].receiver_id;
                    let message_created_at = chatMessages[i].created_at;

                    // Convert created_at to a Date object
                    let date = new Date(message_created_at);

                    // Format the date to IST
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

                    let chatMessageHtml = "";

                    if (message_sender_id == sender_id) {
                        chatMessageHtml = `<div class="chat_message_item chat_message_item_outgoing"
                                               data-id="${message_id}"
                                               data-sender-id="${message_sender_id}"
                                               data-receiver-id="${message_receiver_id}"
                                               data-created-at="${formattedDate}">
                                                <div class="chat_message_content">
                                                    <p>${chatMessage}</p>
                                                </div>
                                            </div>`;
                    } else if (message_receiver_id == sender_id) {
                        chatMessageHtml = `<div class="chat_message_item chat_message_item_incoming"
                                               data-id="${message_id}"
                                               data-sender-id="${message_sender_id}"
                                               data-receiver-id="${message_receiver_id}"
                                               data-created-at="${formattedDate}">
                                                <div class="chat_message_content">
                                                    <p>${chatMessage}</p>
                                                </div>
                                            </div>`;
                    }

                    chatMessagesHtml += chatMessageHtml;
                }

                $("#chat_area_messages").append(chatMessagesHtml);
                scrollChatAreaToBottom();
            }

             else {
                console.log(response);
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error:", status, error);
        },
    });
}


// Scroll chat area to bottom
function scrollChatAreaToBottom() {
    $("#chat_area_messages").animate(
        { scrollTop: $("#chat_area_messages")[0].scrollHeight },
        0
    );
}

$(".back_to_list").on("click", function ()
{
    $(".chat_outerarea").hide();
    $(".back_to_list").hide();
    $(".chatlist_outerarea").show();
});


// document.addEventListener("DOMContentLoaded", function() {
//     const modal = document.getElementById("messageModal");
//     const closeBtn = document.querySelector(".modal .close");
//     const deleteBtn = document.getElementById("deleteMessageBtn");

//     // Show modal on double-click if receiver_id matches sender_id
//     document.querySelectorAll(".chat_message_item").forEach(item => {
//         item.addEventListener("dblclick", function() {
//             const receiverId = this.getAttribute("data-receiver-id");
//             const senderId = window.sender_id; // Global sender_id variable
//             console.log('Double-click detected on message:', this);
//             console.log('Receiver ID:', receiverId);
//             console.log('Sender ID:', senderId);

//             if (receiverId == senderId) {
//                 // Populate modal with message content and set delete button id
//                 document.getElementById("modalMessageContent").innerText = this.querySelector(".chat_message_content p").innerText;
//                 deleteBtn.setAttribute("data-message-id", this.getAttribute("data-id"));

//                 // Display the modal
//                 modal.style.display = "block";
//                 console.log('Modal displayed with message ID:', this.getAttribute("data-id"));
//             }
//         });
//     });

//     // Close the modal
//     closeBtn.onclick = function() {
//         modal.style.display = "none";
//     }

//     // Close the modal if clicked outside
//     window.onclick = function(event) {
//         if (event.target == modal) {
//             modal.style.display = "none";
//         }
//     }

//     // Handle delete action
//     deleteBtn.addEventListener("click", function() {
//         const messageId = this.getAttribute("data-message-id");
//         console.log('Attempting to delete message with ID:', messageId);
//         // Call the backend API to delete the message
//         fetch(`/delete-message/${messageId}`, {
//             method: 'DELETE',
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.status === 'success') {
//                 // Remove message from the chat area
//                 document.querySelector(`.chat_message_item[data-id="${messageId}"]`).remove();
//                 modal.style.display = "none";
//                 console.log('Message deleted successfully.');
//             } else {
//                 alert('Failed to delete message');
//             }
//         })
//         .catch(error => console.error('Error:', error));
//     });
// });


// document.addEventListener("DOMContentLoaded", function() {
//     const chatArea = document.getElementById("chat_area_messages");

//     // Prevent default context menu from appearing
//     chatArea.addEventListener("contextmenu", function(event) {
//         event.preventDefault();
//     });

//     // Handle double-click event
//     chatArea.addEventListener("dblclick", function(event) {
//         const messageItem = event.target.closest(".chat_message_item");
//         if (messageItem) {
//             const receiverId = messageItem.getAttribute("data-receiver-id");
//             if (receiverId == sender_id) {
//                 openModal(messageItem);
//             }
//         }
//     });
// });


// function openModal(messageItem) {
//     const messageContent = messageItem.querySelector(".chat_message_content p").innerText;
//     const messageId = messageItem.getAttribute("data-id");

//     document.getElementById("modalMessageContent").innerText = messageContent;
//     document.getElementById("deleteMessageBtn").setAttribute("data-message-id", messageId);

//     document.getElementById("messageModal").style.display = "block";
// }

// document.querySelector(".close").addEventListener("click", function() {
//     document.getElementById("messageModal").style.display = "none";
// });

// window.addEventListener("click", function(event) {
//     if (event.target === document.getElementById("messageModal")) {
//         document.getElementById("messageModal").style.display = "none";
//     }
// });


$(document).on("dblclick", ".chat_item_message", function () {
    alert("Chat item double-clicked");
});

// $(document).ready(function () {
//     console.log("Custom JS loaded");

//     $(".chat_item_message").on("dblclick", function () {
//         console.log("Chat item double-clicked");
//     });
// });


