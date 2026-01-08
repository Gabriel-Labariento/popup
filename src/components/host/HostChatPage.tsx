import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client/supabase';
import { ChatInterface } from '../chat/ChatInterface';
import { UserAuth } from '@/context/AuthContext';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function HostChatPage() {
    const { applicationId } = useParams();
    const { session } = UserAuth();
    const [loading, setLoading] = useState(true);
    const [chatDetails, setChatDetails] = useState<{
        vendorName: string;
        eventTitle: string;
    } | null>(null);

    useEffect(() => {
        if (applicationId) fetchDetails();
    }, [applicationId]);

    async function fetchDetails() {
        try {
            const { data, error } = await supabase
                .from('applications')
                .select(`
          vendor:vendors (business_name),
          event:events (title)
        `)
                .eq('id', applicationId)
                .single();

            if (error) throw error;

            const typedData = data as any;
            setChatDetails({
                vendorName: (Array.isArray(typedData.vendor) ? typedData.vendor[0]?.business_name : typedData.vendor?.business_name) || 'Vendor',
                eventTitle: (Array.isArray(typedData.event) ? typedData.event[0]?.title : typedData.event?.title) || 'Event'
            });
        } catch (error) {
            console.error('Error fetching chat details:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-rose-600" /></div>;
    if (!chatDetails || !session) return <div>Chat not found</div>;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <Link to="/host/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-rose-600 mb-6 transition-colors">
                <ArrowLeft size={18} /> Back to Dashboard
            </Link>

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Message Vendor</h1>
                <p className="text-slate-500">
                    Discussing <span className="font-semibold">{chatDetails.eventTitle}</span>
                </p>
            </div>

            <ChatInterface
                applicationId={applicationId!}
                currentUserId={session.user.id}
                otherPartyName={chatDetails.vendorName}
            />
        </div>
    );
}
