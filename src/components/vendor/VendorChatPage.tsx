import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client/supabase';
import { ChatInterface } from '../chat/ChatInterface';
import { UserAuth } from '@/context/AuthContext';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function VendorChatPage() {
    const { applicationId } = useParams();
    const { session } = UserAuth();
    const [loading, setLoading] = useState(true);
    const [chatDetails, setChatDetails] = useState<{
        hostName: string;
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
          event:events (
            title,
            host:hosts (organization_name)
          )
        `)
                .eq('id', applicationId)
                .single();

            if (error) throw error;

            const typedData = data as any;
            const eventData = Array.isArray(typedData.event) ? typedData.event[0] : typedData.event;
            const hostData = eventData && Array.isArray(eventData.host) ? eventData.host[0] : eventData?.host;

            setChatDetails({
                hostName: hostData?.organization_name || 'Host',
                eventTitle: eventData?.title || 'Event'
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
            <Link to="/vendor/applications" className="inline-flex items-center gap-2 text-slate-500 hover:text-rose-600 mb-6 transition-colors">
                <ArrowLeft size={18} /> Back to My Applications
            </Link>

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Message Host</h1>
                <p className="text-slate-500">
                    Regarding <span className="font-semibold">{chatDetails.eventTitle}</span>
                </p>
            </div>

            <ChatInterface
                applicationId={applicationId!}
                currentUserId={session.user.id}
                otherPartyName={chatDetails.hostName}
            />
        </div>
    );
}
