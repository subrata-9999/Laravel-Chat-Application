<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Chat;
use App\Events\MessageEvent;
use App\Events\MessageSender;
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

            return response()->json(['status' => 'success', 'data' => $chats]);

        } catch (\Exception $e) {
            Log::error('Chat load failed: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}
