import React, { useEffect, useState, useCallback } from 'react';
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
        vendorImage?: string | null;
        eventTitle: string;
    } | null>(null);

    const fetchDetails = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('applications')
                .select(`
          vendor:vendors (business_name, logo_url),
          event:events (title)
        `)
                .eq('id', applicationId)
                .single();

            if (error) throw error;

            interface ApplicationData {
                vendor: { business_name: string } | { business_name: string }[] | null;
                event: { title: string } | { title: string }[] | null;
            }

            const typedData = data as unknown as ApplicationData;

            // Helper to handle Supabase's potential array return if relationship is one-to-many (though here it should be single)
            const getVendorName = (v: ApplicationData['vendor']) =>
                Array.isArray(v) ? v[0]?.business_name : v?.business_name;
            const getEventTitle = (e: ApplicationData['event']) =>
                Array.isArray(e) ? e[0]?.title : e?.title;

            setChatDetails({
                vendorName: getVendorName(typedData.vendor) || 'Vendor',
                vendorImage: (typedData.vendor as any)?.logo_url || null, // Cast to any to avoid strict type issues if interface isn't fully updated
                eventTitle: getEventTitle(typedData.event) || 'Event'
            });
        } catch (_error) {
            // Failed to fetch chat details
        } finally {
            setLoading(false);
        }
    }, [applicationId]);

    useEffect(() => {
        if (applicationId) fetchDetails();
    }, [applicationId, fetchDetails]);

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
                otherPartyImage={chatDetails.vendorImage}
            />
        </div>
    );
}
