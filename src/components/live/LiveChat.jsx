import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, User } from 'lucide-react';
import { fetchChatMessages, sendChatMessage } from '../../services/supabase';

export default function LiveChat() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const lastIdRef = useRef(null);

  // Retrieve saved nickname
  useEffect(() => {
    const savedName = localStorage.getItem('top_chat_name');
    if (savedName) setName(savedName);
  }, []);

  const pollMessages = async () => {
    try {
      const data = await fetchChatMessages(30, lastIdRef.current);
      if (data && data.length > 0) {
        if (!lastIdRef.current) {
          setMessages(data);
          lastIdRef.current = data[data.length - 1]?.id;
        } else {
          setMessages(prev => [...prev, ...data]);
          lastIdRef.current = data[data.length - 1]?.id;
        }

        if (!userScrolledUp && chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }
    } catch (err) {
      console.warn('Chat poll error:', err);
    }
  };

  useEffect(() => {
    pollMessages();
    const interval = setInterval(pollMessages, 4000);
    return () => clearInterval(interval);
  }, [userScrolledUp]);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setUserScrolledUp(scrollHeight - (scrollTop + clientHeight) > 60);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!name.trim() || !messageText.trim() || sending) return;

    setSending(true);
    localStorage.setItem('top_chat_name', name.trim());

    try {
      await sendChatMessage({
        name: name.trim(),
        message: messageText.trim()
      });
      setMessageText('');
      setUserScrolledUp(false);
      pollMessages();
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setTimeout(() => setSending(false), 1200);
    }
  };

  return (
    <div className="flex flex-col h-[520px] rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 bg-black/60 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-accent" />
          <h3 className="font-cinzel text-xs font-bold uppercase tracking-wider text-white">
            Live Congregation Chat
          </h3>
        </div>
        <span className="text-[10px] text-white/40 tracking-widest uppercase">
          Real-time
        </span>
      </div>

      {/* Messages Feed */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-white/10"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-white/40 text-xs px-4">
            Welcome to the live chat! Be the first to praise God and declare your expectations.
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="text-xs leading-relaxed animate-fadeIn">
              <span className="font-bold text-brand-accent mr-1.5 inline-flex items-center gap-1">
                <User className="w-2.5 h-2.5 opacity-60 inline" />
                {msg.name}:
              </span>
              <span className="text-white/90 break-words">{msg.message}</span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSendMessage} className="p-3 bg-black/80 border-t border-white/10 flex flex-col gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name (e.g. Sis Sarah)"
          required
          className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-brand-accent"
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your praise or prayer..."
            required
            className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-brand-accent"
          />
          <button
            type="submit"
            disabled={sending || !messageText.trim() || !name.trim()}
            className="px-4 py-2 rounded-lg bg-brand-accent text-brand-primary font-bold text-xs hover:bg-brand-accent-light transition-all disabled:opacity-40 flex items-center justify-center"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
