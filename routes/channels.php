<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('status-update', function ($user) {
    return $user;
});

Broadcast::channel('broadcast-message', function ($user) {
    return true;
});

Broadcast::channel('test-channel', function ($user) {
    return $user; // Or implement proper authorization logic
});

Broadcast::channel('chat.{receiver_id}', function ($user, $receiver_id) {
    return $user->id === (int) $receiver_id;
});

Broadcast::channel('Message-send', function ($user) {
    return $user;
});
