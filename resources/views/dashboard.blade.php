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
                                <div class="chatitem_message">Hello, how are you hello?</div>
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
                    <!-- chat messages -->
                    <div class="chat_area_messages" id="chat_area_messages">

                        <!-- the chat will be displayed here -->



                    </div>


                    <!-- chat input -->
                    <div class="chat_area_input">
                        <form id="chat-form" class="chat_message_form">
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
