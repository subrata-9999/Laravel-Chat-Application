<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use App\Models\Chat;

class MessageEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $chatData;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($chatData)
    {
        $this->chatData = $chatData;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('broadcast-message');
    }

    /**
     * Get the broadcastable data for the event.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'chat' => $this->chatData
        ];
    }

    public function broadcastAs()
    {
        return 'endMessageEvent';
    }
}
