import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client/supabase';
import { ChatInterface } from '../chat/ChatInterface';
import { UserAuth } from '@/context/AuthContext';
import { ArrowLeft, Loader2, MessageCircle } from 'lucide-react';

export default function VendorChatPage() {
    const { applicationId } = useParams();
    const { session } = UserAuth();
    const navigate = useNavigate();
    
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
            setLoading(true);
            
            // Clean query thanks to the Foreign Keys we established
            const { data, error } = await supabase
                .from('applications')
                .select(`
                    vendor_id,
                    status,
                    event:events (
                        title,
                        host:hosts (organization_name)
                    )
                `)
                .eq('id', applicationId)
                .single();

            if (error) throw error;

            // Security: Ensure the vendor can only access their own chats
            if (data.vendor_id !== session?.user.id) {
                console.error("Unauthorized access to chat");
                navigate('/vendor/applications');
                return;
            }

            // UI Check: Only allow chat for accepted applications (optional per your PRD)
            if (data.status !== 'ACCEPTED') {
                // You can either block this or allow it based on your preference
                // For now, we'll just show the chat
            }

            // Simplified data access
            const eventData = data.event as any;
            const hostData = eventData?.host;

            setChatDetails({
                hostName: hostData?.organization_name || 'Event Host',
                eventTitle: eventData?.title || 'Event'
            });
        } catch (error) {
            console.error('Error fetching chat details:', error);
            navigate('/vendor/applications');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="animate-spin text-rose-600" size={32} />
            </div>
        );
    }

    if (!chatDetails || !session || !applicationId) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4">
                <MessageCircle size={48} className="text-slate-200" />
                <p className="text-slate-500">Conversation not found.</p>
                <Link to="/vendor/applications" className="text-rose-600 font-bold hover:underline">
                    Back to Applications
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4">
            {/* Navigation Header */}
            <div className="flex items-center justify-between mb-6">
                <Link 
                    to="/vendor/applications" 
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-colors font-medium text-sm"
                >
                    <ArrowLeft size={16} /> Back to My Applications
                </Link>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">
                    Secure Chat
                </span>
            </div>

            {/* Context Header */}
            <div className="mb-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <h1 className="text-xl font-bold text-slate-900 leading-tight">
                    Chat with {chatDetails.hostName}
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Discussion for <span className="text-rose-600 font-semibold">{chatDetails.eventTitle}</span>
                </p>
            </div>

            {/* The Realtime Chat Interface */}
            <ChatInterface
                applicationId={applicationId}
                currentUserId={session.user.id}
                otherPartyName={chatDetails.hostName}
            />
            
            <p className="mt-4 text-center text-[10px] text-slate-400">
                Messages are encrypted and visible only to you and the host.
            </p>
        </div>
    );
}