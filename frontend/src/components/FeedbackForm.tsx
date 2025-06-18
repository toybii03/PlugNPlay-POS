import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import api from '@/lib/api';
import { toast } from 'sonner';

interface FeedbackFormProps {
    orderId: string;
    customerId: string;
    onSuccess?: () => void;
}

export function FeedbackForm({ orderId, customerId, onSuccess }: FeedbackFormProps) {
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        try {
            setSubmitting(true);
            await api.post('/feedback', {
                order_id: orderId,
                customer_id: customerId,
                rating,
                comment
            });

            toast.success('Thank you for your feedback!');
            onSuccess?.();
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.error('Failed to submit feedback. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle>How was your experience?</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center space-x-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setRating(value)}
                                className={`w-12 h-12 rounded-full text-2xl ${
                                    rating >= value
                                        ? 'bg-yellow-400 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                }`}
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    <Textarea
                        placeholder="Tell us more about your experience (optional)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[100px]"
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit Feedback'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
} 