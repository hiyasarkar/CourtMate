import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Send,  Paperclip, FileText, Check, Clock } from 'lucide-react';

const ChatWindow = ({ caseId, currentUser, otherUser, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: true });
      
      if (data) setMessages(data);
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`case-chat-${caseId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `case_id=eq.${caseId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [caseId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        case_id: caseId,
        sender_id: currentUser.id, // Assuming currentUser has .id
        receiver_id: otherUser?.id, // Assuming otherUser has .id
        content: newMessage,
        created_at: new Date().toISOString()
      });

    if (!error) {
      setNewMessage('');
    } else {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[500px] z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold border border-white/30">
            {otherUser?.full_name?.charAt(0) || 'L'}
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight">{otherUser?.full_name || 'Lawyer'}</h3>
            <span className="text-xs text-orange-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
            </span>
          </div>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white transition">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUser.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm relative group ${
                isMe 
                  ? 'bg-orange-500 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
              }`}>
                {msg.is_system_message ? (
                   <div className="flex items-start gap-2 italic text-gray-500 bg-gray-100 p-2 rounded-lg text-xs border border-gray-200">
                     <FileText className="w-4 h-4 mt-0.5 shrink-0" />
                     {msg.content}
                   </div>
                ) : (
                   <p>{msg.content}</p>
                )}
                <div className={`text-[10px] mt-1 flex items-center gap-1 ${isMe ? 'text-orange-100 justify-end' : 'text-gray-400'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {isMe && <Check className="w-3 h-3" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
        <button type="button" className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-50 transition">
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-gray-100 text-gray-900 placeholder-gray-500 text-sm px-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition border-transparent border"
        />
        <button 
          type="submit" 
          disabled={!newMessage.trim()}
          className="bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-full shadow-lg shadow-orange-500/30 transition disabled:opacity-50 disabled:shadow-none transform hover:scale-105 active:scale-95"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
