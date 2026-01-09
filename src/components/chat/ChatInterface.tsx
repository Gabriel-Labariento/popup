import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase/client/supabase';
import { Send, Loader2, User, Paperclip } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
    id: string;
    sender_id: string;
    content: string;
    created_at: string;
    sender?: {
        organization_name?: string;
        business_name?: string;
    }

}
interface ChatInterfaceProps {
    applicationId: string;
    currentUserId: string;
    otherPartyName: string; // To display in header
}

export function ChatInterface({ applicationId, currentUserId, otherPartyName }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [receiverId, setReceiverId] = useState<string | null>(null); // Optimized
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 1. Initial Fetch
        fetchMessages();
        fetchReceiverId();

        // 2. Setup Realtime Subscription
        const channel = supabase
            .channel(`chat:${applicationId}`) // Unique channel name
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `application_id=eq.${applicationId}`,
                },
                (payload) => {
                    // Append the new message to state immediately
                    const newMsg = payload.new as Message;

                    // Prevention: Only append if it's not already there (prevents double-render on sender side)
                    setMessages((prev) => {
                        if (prev.find(m => m.id === newMsg.id)) return prev;
                        return [...prev, newMsg];
                    });
                }
            )
            .subscribe();

        // 3. Cleanup on unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, [applicationId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Optimization: Find out who we are talking to once, instead of every message
    async function fetchReceiverId() {
        const { data: appData } = await supabase
            .from('applications')
            .select('vendor_id, event:events(host_id)')
            .eq('id', applicationId)
            .single();

        if (appData) {
            const hostId = (appData.event as any).host_id;
            const target = currentUserId === appData.vendor_id ? hostId : appData.vendor_id;
            setReceiverId(target);
        }
    }

    async function fetchMessages() {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('application_id', applicationId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !receiverId) return;

        try {
            setSending(true);
            const { error } = await supabase
                .from('messages')
                .insert({
                    application_id: applicationId,
                    sender_id: currentUserId,
                    receiver_id: receiverId,
                    content: newMessage.trim(),
                });

            if (error) throw error;
            setNewMessage('');
            // Note: We NO LONGER need fetchMessages() here. 
            // The Realtime subscription will hear our own "INSERT" and update the UI.
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    if (loading) {
    return (
        <div className="flex bg-slate-50 rounded-xl h-[500px] items-center justify-center border border-slate-200">
            <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
        </div>
    );
}

return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center">
                <User size={20} className="text-slate-500" />
            </div>
            <div>
                <h3 className="font-bold text-slate-800">{otherPartyName}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Active
                </p>
            </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
            {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <p className="text-sm">No messages yet. Start the conversation!</p>
                </div>
            ) : (
                messages.map((msg) => {
                    const isMe = msg.sender_id === currentUserId;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${isMe
                                    ? 'bg-rose-600 text-white rounded-tr-sm'
                                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                                    }`}
                            >
                                <p className="text-sm leading-relaxed">{msg.content}</p>
                                <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-rose-100' : 'text-slate-400'}`}>
                                    {format(new Date(msg.created_at), 'h:mm a')}
                                </p>
                            </div>
                        </div>
                    );
                })
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white flex gap-2">
            <button
                type="button"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                title="Attach file (coming soon)"
            >
                <Paperclip size={20} />
            </button>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-slate-50 border-0 rounded-full px-4 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
            <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="bg-rose-600 text-white p-2.5 rounded-full hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-rose-600/20"
            >
                {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
        </form>
    </div>
);
}