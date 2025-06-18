<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Order;
use App\Models\Customer;
use App\Models\CustomerFeedback;

class WebhookController extends Controller
{
    public function handleAsanaWebhook(Request $request)
    {
        try {
            $payload = $request->all();

            // Verify webhook signature if provided
            if ($request->header('X-Asana-Signature')) {
                // Implement signature verification
            }

            // Handle different event types
            switch ($payload['event']) {
                case 'task_updated':
                    $this->handleTaskUpdate($payload);
                    break;
                case 'task_created':
                    $this->handleTaskCreated($payload);
                    break;
            }

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('Asana webhook error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function handleSlackWebhook(Request $request)
    {
        try {
            $payload = $request->all();

            // Verify webhook signature if provided
            if ($request->header('X-Slack-Signature')) {
                // Implement signature verification
            }

            // Handle different event types
            switch ($payload['type']) {
                case 'message':
                    $this->handleSlackMessage($payload);
                    break;
            }

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('Slack webhook error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function handleCustomerInteraction(Request $request)
    {
        try {
            $payload = $request->all();

            // Create Asana task for customer interaction
            $this->createAsanaTask([
                'name' => "Customer Interaction: {$payload['customer_name']}",
                'notes' => $payload['interaction_details'],
                'workspace' => config('services.asana.workspace_id'),
                'projects' => [config('services.asana.customer_project_id')]
            ]);

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('Customer interaction webhook error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function handleTaskUpdate($payload)
    {
        // Send notification to Slack
        $this->sendSlackMessage(
            config('services.slack.notifications_channel'),
            "Task Updated: {$payload['task']['name']}\nStatus: {$payload['task']['status']}"
        );
    }

    private function handleTaskCreated($payload)
    {
        // Send notification to Slack
        $this->sendSlackMessage(
            config('services.slack.notifications_channel'),
            "New Task Created: {$payload['task']['name']}\nAssigned to: {$payload['task']['assignee']}"
        );
    }

    private function handleSlackMessage($payload)
    {
        // Handle incoming Slack messages if needed
        Log::info('Received Slack message: ' . json_encode($payload));
    }

    private function createAsanaTask($taskData)
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.asana.access_token'),
            'Content-Type' => 'application/json'
        ])->post('https://app.asana.com/api/1.0/tasks', $taskData);

        if (!$response->successful()) {
            throw new \Exception('Failed to create Asana task: ' . $response->body());
        }

        return $response->json();
    }

    private function sendSlackMessage($channel, $message)
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.slack.bot_token'),
            'Content-Type' => 'application/json'
        ])->post('https://slack.com/api/chat.postMessage', [
            'channel' => $channel,
            'text' => $message
        ]);

        if (!$response->successful()) {
            throw new \Exception('Failed to send Slack message: ' . $response->body());
        }

        return $response->json();
    }
}
