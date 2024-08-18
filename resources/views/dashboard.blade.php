<x-app-layout>

    <?php
    // echo '<pre>';
    // print_r($users->toArray());
    // echo '</pre>';
    // exit;
    ?>

    @if (count($users) > 0)

    <div class="outer_container">
        <div class="main_container_1">

        <div id="youtubePicker" style="display: none;">
    <iframe id="youtubeIframe" src="https://www.youtube.com/embed?listType=search&list=" width="800" height="600" frameborder="0" allowfullscreen></iframe>
</div>


            <!-- chat list -->
            <div class="chatlist_outerarea">
                <div class="chatlist_area">
                    <div class="chatlist_heading">
                        <div class="chatlist_title">Chats</div>
                        <div class="chatlist_search">
                            <input type="text" placeholder="Search">
                        </div>
                    </div>
                    @foreach($users as $user)
                    <div class="chatlist_item" id="{{ $user->id }}-chatPerson"
                        data-id="{{ $user->id }}"
                        data-name="{{ $user->name }}"
                        data-image="{{ asset($user->image) }}"
                        data-info="Info"> <!-- Update 'data-info' as needed -->
                        <div class="chatitem_image">
                            <img src="{{ asset($user->image) }}" alt="{{ $user->name }}">
                        </div>
                        <div class="chatitem_details">
                            <div class="chat_details_row1">
                                <div class="chatitem_name">{{ $user->name }}</div>
                                <div class="chatitem_status">
                                    <h3 class="offline_status" id="{{ $user->id }}-status">Offline</h3>
                                </div>
                            </div>
                            <div class="chat_details_row2">
                                <div class="chatitem_message">Hello, how are you?</div>
                                <div class="chatitem_time">10:00 AM</div>
                            </div>
                        </div>
                    </div>
                    @endforeach




                </div>

            </div>


            <!-- chat area -->
            <!-- Blank introductory page -->
            <div class="chat_outerarea_pre">
                <div class="chat_area_pre">
                    <img class="backgroundImage_forblank" src="{{ asset('g_image/bg_chat_app_image.png') }}" alt="Background Image">
                    <div class="welcome_message">
                        <h1>Welcome to My Chat App</h1>
                        <p>Made with Laravel, Websockets, Pusher, Echo</p>
                    </div>
                </div>
            </div>

            <div class="chat_outerarea" style="display: none;">
                <div class="chat_area">

                    <!-- chat person info -->
                    <div class="chatPersonDetails">
                        <div class="back_to_list" style="display: none; margin-right: 8px;"><i class="fa-solid fa-arrow-left"></i></div>
                        <div class="chatPersonImage"><img id="chatPersonImage" src="" alt=""></div>
                        <div class="chatPersonName">
                            <h3 id="chatPersonName"></h3>
                        </div>
                        <div class="chatPersonInfo">
                            <h4 id="chatPersonInfo"></h4>
                        </div>
                    </div>
                    <!-- second modal for update message -->
                    <div id="updateModal_2" class="update_modal_2" style="display: none; z-index: 1000;">
                        <div class="modal-content">
                            <span class="close">&times;</span>
                            <h2><b>Update</b></h2>
                            <form class="update_message_2" id="update_message_2">
                                <input type="hidden" id="updated_model_id" value="">
                                <input type="text" id="updated_model_message" value="">
                                <button type="submit" class="update_button_2">Update Message</button>
                            </form>
                        </div>
                    </div>
                    <!-- Modal for Message options -->
                    <div id="messageModal" class="modal" style="display: none; z-index: 1000;">
                        <div class="modal-content">
                            <span class="close">&times;</span>
                            <p><strong></strong> <span id="modalSentAt"></span></p>
                            <form class="update_message" id="update_message">
                                <input type="hidden" id="modalSentIDinputupdate" value="">
                                <input type="hidden" id="modelMessageinputupdate" value="">
                                <button type="submit" class="updateButton">Update Message</button>
                            </form>
                            <form class="dlt_message" id="dlt_message">
                                <input type="hidden" id="modalSentIDinputdelete" value="">
                                <button type="submit" class="deleteButton">Delete Message</button>
                            </form>
                        </div>
                    </div>
                    <!-- chat messages -->
                    <div class="chat_area_messages" id="chat_area_messages">

                        <!-- the chat will be displayed here -->






                    </div>


                    <!-- chat input -->
                    <div class="chat_area_input">
                        <form id="chat-form" class="chat_message_form">


                            <div style="cursor: pointer;"><p style="cursor: pointer;" class="trigger">😀</p></div>
                            <div class="chat_message_input">
                            <input type="text" id="chat_message_input" name="message" placeholder="Type a message">
                            </div>
                            <div class="chat_message_send">
                                <button type="submit" id="chat_message_send">Send</button>
                            </div>
                        </form>
                    </div>

                </div>

            </div>


        </div>
    </div>

    @else
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="alert alert-warning">
                    <p>No users found</p>
                </div>
            </div>
        </div>
    </div>
    @endif


</x-app-layout>
