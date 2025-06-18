<?php

namespace App\Services;

use App\Models\EmailTemplate;
use App\Models\Order;
use App\Models\Customer;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Config;

class EmailService
{
    public function sendReceiptEmail(Order $order, Customer $customer)
    {
        $template = EmailTemplate::where('type', 'receipt')->first();

        if (!$template) {
            throw new \Exception('Receipt email template not found');
        }

        // Get store settings
        $storeSettings = Config::get('store_settings');

        // Prepare email content
        $replacements = [
            'store_name' => $storeSettings['store_name'],
            'customer_name' => $customer->name,
            'order_details' => $this->formatOrderDetails($order),
            'total_amount' => number_format($order->total_amount, 2),
            'farewell_message' => $this->getRandomFarewellMessage()
        ];

        $subject = $template->getFormattedBody($replacements);
        $body = $template->getFormattedBody($replacements);

        // Send email
        Mail::send([], [], function ($message) use ($customer, $subject, $body) {
            $message->to($customer->email)
                   ->subject($subject)
                   ->setBody($body, 'text/html');
        });

        return true;
    }

    public function sendFeedbackRequestEmail(Order $order, Customer $customer)
    {
        $template = EmailTemplate::where('type', 'feedback')->first();

        if (!$template) {
            throw new \Exception('Feedback email template not found');
        }

        // Get store settings
        $storeSettings = Config::get('store_settings');

        // Generate feedback link
        $feedbackLink = route('feedback', [
            'order_id' => $order->id,
            'token' => $this->generateFeedbackToken($order)
        ]);

        // Prepare email content
        $replacements = [
            'store_name' => $storeSettings['store_name'],
            'customer_name' => $customer->name,
            'feedback_link' => $feedbackLink
        ];

        $subject = $template->getFormattedBody($replacements);
        $body = $template->getFormattedBody($replacements);

        // Send email
        Mail::send([], [], function ($message) use ($customer, $subject, $body) {
            $message->to($customer->email)
                   ->subject($subject)
                   ->setBody($body, 'text/html');
        });

        return true;
    }

    private function formatOrderDetails(Order $order)
    {
        $details = "Order #{$order->id}\n\n";
        $details .= "Items:\n";

        foreach ($order->items as $item) {
            $details .= "- {$item->quantity}x {$item->product->name}: $" . number_format($item->subtotal, 2) . "\n";
        }

        $details .= "\nSubtotal: $" . number_format($order->total_amount - $order->tax_amount, 2) . "\n";
        $details .= "Tax: $" . number_format($order->tax_amount, 2) . "\n";
        $details .= "Total: $" . number_format($order->total_amount, 2);

        return $details;
    }

    private function getRandomFarewellMessage()
    {
        $messages = [
            "Thank you for your purchase!",
            "We appreciate your business!",
            "Have a great day!",
            "Thank you for shopping with us!",
            "We hope to see you again soon!"
        ];

        return $messages[array_rand($messages)];
    }

    private function generateFeedbackToken(Order $order)
    {
        // Generate a secure token for feedback
        return hash_hmac('sha256', $order->id . $order->created_at, Config::get('app.key'));
    }
}
