<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Chat;
use App\Events\MessageEvent;
use App\Events\MessageSender;
use App\Events\MessageDelete;
use App\Events\MessageUpdate;
use GuzzleHttp\Psr7\Message;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function loadDashboard()
    {
        $users = User::whereNotIN('id', [auth()->id()])->get();
        return view('dashboard', compact('users'));
    }
    public function saveChat(Request $request)
    {
        $validated = $request->validate([
            'sender_id' => 'required|integer',
            'receiver_id' => 'required|integer',
            'message' => 'required|string'
        ]);
        try {
            $chat = Chat::create([
                'sender_id' => $validated['sender_id'],
                'receiver_id' => $validated['receiver_id'],
                'message' => $validated['message']
            ]);

            event(new MessageSender($chat)); //event hit

            return response()->json(['status' => 'success', 'data' => $chat]);
        } catch (\Exception $e) {
            Log::error('Chat save failed: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    //
    public function loadChat(Request $request)
    {
        $validated = $request->validate([
            'sender_id' => 'required|integer',
            'receiver_id' => 'required|integer'
        ]);
        try {
            $chats = Chat::where(function ($query) use ($validated) {
                $query->where('sender_id', $validated['sender_id'])
                    ->where('receiver_id', $validated['receiver_id']);
            })->orWhere(function ($query) use ($validated) {
                $query->where('sender_id', $validated['receiver_id'])
                    ->where('receiver_id', $validated['sender_id']);
            })->get();
            // print_r($chats);

            return response()->json(['status' => 'success', 'data' => $chats]);
        } catch (\Exception $e) {
            Log::error('Chat load failed: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function deleteChat(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'id' => 'required|integer',
        ]);

        try {
            // Attempt to find the chat by its ID
            $chat = Chat::find($validated['id']);

            // Check if the chat exists
            if (!$chat) {
                return response()->json(['status' => 'error', 'message' => 'Chat not found']);
            }

            // Trigger the event before deleting the chat
            event(new MessageDelete($chat->id));

            // Delete the chat
            $chat->delete();

            // Return success response
            return response()->json(['status' => 'success', 'message' => 'Chat deleted successfully']);
        } catch (\Exception $e) {
            // Log the error and return a generic error message
            Log::error('Chat delete failed: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'An error occurred while deleting the chat']);
        }
    }
    public function updateChat(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'id' => 'required|integer',
            'message' => 'required|string',
        ]);

        try {
            // Attempt to find the chat by its ID
            $chat = Chat::find($validated['id']);

            // Check if the chat exists
            if (!$chat) {
                return response()->json(['status' => 'error', 'message' => 'Chat not found']);
            }

            // Update the chat message
            $chat->message = $validated['message'];
            $chat->save();

            event(new MessageUpdate($chat->id, $chat->message));


            // Return success response
            return response()->json(['status' => 'success', 'message' => 'Chat updated successfully']);
        } catch (\Exception $e) {
            // Log the error and return a generic error message
            Log::error('Chat update failed: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'An error occurred while updating the chat']);
        }
    }
}
