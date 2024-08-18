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
    host: window.location.hostname + ":6001",
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
                $(".chatlist_outerarea").hide();
                $(".chat_outerarea").show();
            } else {
                $(".chat_outerarea").hide();
                $(".chatlist_outerarea").show();
            }
            $(".chat_outerarea_pre").hide();
            $(".back_to_list").show();
        } else {
            $(".chatlist_outerarea").show();
            if (receiver_id) {
                $(".chat_outerarea").show();
            } else {
                $(".chat_outerarea_pre").show();
            }
            $(".back_to_list").hide();
        }
    }
    handleResize();

    // Add event listener to all chat list items, for char loading, and chat area display
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
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        timeZone: "Asia/Kolkata",
                    };
                    let formattedDate = date.toLocaleString("en-GB", options);

                    let chatMessageHtml = `<div class="chat_message_item chat_message_item_outgoing"
                                               data-id="${message_id}"
                                               data-sender-id="${message_sender_id}"
                                               data-receiver-id="${message_receiver_id}"
                                               data-created-at="${formattedDate}"
                                               data-chatMessage="${chatMessage}">

                                                <div class="chat_message_content">
                                                    <p>${chatMessage}</p>
                                                </div>
                                            </div>`;

                    $("#chat_area_messages").append(chatMessageHtml);
                    scrollChatAreaToBottom();
                } else {
                    console.log(response);
                }
                // console.log(response);
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", status, error);
            },
        });
    });

    // For resizing the window
    $(window).resize(function () {
        handleResize();
        scrollChatAreaToBottom();
    });

    // Function to open the message details modal at the clicked position
    function openMessageDetails(
        messageId,
        chatMessage,
        senderId,
        receiverId,
        formattedDate,
        x,
        y
    ) {
        console.log("messageId from open message details function ", messageId);
        const modal = $("#messageModal");

        // Set the content in the modal
        $("#modalMessageId").text(messageId);
        $("#modalMessageContent").text(chatMessage);
        $("#modalSenderId").text(senderId);
        $("#modalReceiverId").text(receiverId);
        $("#modalSentAt").text(formattedDate);

        // Set the message ID in the delete form hidden input
        $("#modalSentIDinputdelete").val(messageId);
        // Set the message ID in the update form hidden input
        $("#modalSentIDinputupdate").val(messageId);
        $("#modelMessageinputupdate").val(chatMessage);

        // Position the modal at the double-clicked location
        modal.css({
            top: y + "px",
            left: x - 290 + "px",
            display: "block",
        });
    }

    // Add event listener to all outgoing chat messages for double-click event
    $(document).on("dblclick", ".chat_message_item_outgoing", function (event) {
        let message_id = $(this).data("id");
        let chatMessage = $(this).find(".chat_message_content p").text();
        let message_sender_id = $(this).data("sender-id");
        let message_receiver_id = $(this).data("receiver-id");
        let message_created_at = $(this).data("created-at");
        console.log("from db click  "+chatMessage);
        // Get the position of the double-click event
        let x = event.pageX;
        let y = event.pageY;

        openMessageDetails(
            message_id,
            chatMessage,
            message_sender_id,
            message_receiver_id,
            message_created_at,
            x,
            y
        );
    });

    // Delete the message when the delete button is clicked
    $("#dlt_message").on("submit", function (e) {
        e.preventDefault(); // Prevent default form submission
        let messageId = $("#modalSentIDinputdelete").val();
        console.log("Deleting message with ID:", messageId);

        $.ajax({
            url: "/delete-chat",
            type: "POST",
            data: {
                id: messageId,
            },
            success: function (response) {
                if (response.status == "success") {
                    // Remove the message from the chat area
                    $(`div[data-id="${messageId}"]`).remove();
                    // Close the modal
                    $("#messageModal").hide();
                } else {
                    console.log(response.message);
                }
            },
            error: function (xhr, status, error) {
                console.log("hey");
                console.error("AJAX Error:", status, error);
            },
        });
    });

    // Open the update message form when the update button is clicked
    $("#update_message").on("submit", function (e) {
        e.preventDefault(); // Prevent default form submission
        let messageId = $("#modalSentIDinputupdate").val();
        let chatMessage = $("#modelMessageinputupdate").val();
        console.log(
            "Updating message with ID:",
            messageId + " to " + chatMessage
        );

        let x = e.pageX;
        let y = e.pageY;

        $("#messageModal").hide();
        const update_model = $("#updateModal_2");

        update_model.css({
            top: y + "px",
            left: x + "px",
            display: "block",
        });

        // Set the message ID in the update form hidden input
        $("#updated_model_id").val(messageId);
        $("#updated_model_message").val(chatMessage);
    });

    // Update the message when the update form is submitted
    $("#update_message_2").on("submit", function (e) {
        e.preventDefault(); // Prevent default form submission
        let messageId = $("#updated_model_id").val();
        let chatMessage = $("#updated_model_message").val();
        console.log(
            "Updating message with ID:",
            messageId + " to " + chatMessage
        );

        $.ajax({
            url: "/update-chat",
            type: "POST",
            data: {
                id: messageId,
                message: chatMessage,
            },
            success: function (response) {
                if (response.status == "success") {
                    // Target the specific message container
                    let messageContainer = $(`div[data-id="${messageId}"]`);

                    // Update the message text in the chat area
                    messageContainer
                        .find(".chat_message_content p")
                        .text(chatMessage);

                    // Update the data-chatMessage attribute with the new message
                    messageContainer.attr("data-chat-message", chatMessage);

                    // Close the modal
                    $("#updateModal_2").hide();
                } else {
                    console.log(response.message);
                }
            },
            error: function (xhr, status, error) {
                console.log("hey1");
                console.error("AJAX Error:", status, error);
            },
        });
    });

    // Close the modal when the close button is clicked
    $("#messageModal .close").on("click", function () {
        $("#messageModal").hide();
    });

    $("#updateModal_2 .close").on("click", function () {
        $("#updateModal_2").hide();
    });

    // Close the modal when the user clicks outside the modal
    $(document).on("click", function (event) {
        if ($(event.target).closest("#messageModal").length === 0) {
            $("#messageModal").hide();
        }
        if ($(event.target).closest("#updateModal_2").length === 0) {
            $("#updateModal_2").hide();
        }
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
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        timeZone: "Asia/Kolkata",
                    };
                    let formattedDate = date.toLocaleString("en-GB", options);

                    let chatMessageHtml = "";

                    if (message_sender_id == sender_id) {
                        chatMessageHtml = `<div class="chat_message_item chat_message_item_outgoing"
                                               data-id="${message_id}"
                                               data-sender-id="${message_sender_id}"
                                               data-receiver-id="${message_receiver_id}"
                                               data-chat-message="${chatMessage}"
                                               data-created-at="${formattedDate}"

                                               >
                                                <div class="chat_message_content">
                                                    <p>${chatMessage}</p>
                                                  </div>
                                            </div>`;
                    } else if (message_receiver_id == sender_id) {
                        chatMessageHtml = `<div class="chat_message_item chat_message_item_incoming"
                                               data-id="${message_id}"
                                               data-sender-id="${message_sender_id}"
                                               data-receiver-id="${message_receiver_id}"
                                               data-chat-message="${chatMessage}"
                                               data-created-at="${formattedDate}">
                                                <div class="chat_message_content"


                                                    <p>${chatMessage}</p>
                                                </div>
                                            </div>`;
                    }

                    chatMessagesHtml += chatMessageHtml;
                }

                $("#chat_area_messages").append(chatMessagesHtml);
                scrollChatAreaToBottom();
            } else {
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

/// Back to chat list arrow, only for <900px
$(".back_to_list").on("click", function () {
    $(".chat_outerarea").hide();
    $(".back_to_list").hide();
    $(".chatlist_outerarea").show();
});

// $(document).ready(function() {

// });




