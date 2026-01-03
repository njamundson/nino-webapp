"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Phone, 
  Video, 
  Image as ImageIcon, 
  Paperclip, 
  Mic, 
  Send,
  Check,
  CheckCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- Mock Data ---

const MOCK_CHATS = [
  {
    id: "1",
    name: "Sarah Miller",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    role: "Marketing Director",
    lastMessage: "The new drone footage looks incredible! 🚁",
    time: "10:23 AM",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "David Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    role: "Creative Lead",
    lastMessage: "Can we adjust the color grade on the sunset clip?",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: "3",
    name: "Four Seasons Maui Team",
    avatar: "", // Group avatar fallback
    isGroup: true,
    role: "Project Channel",
    lastMessage: "Emma: Updated the asset collection for Q3.",
    time: "Tuesday",
    unread: 5,
    online: true,
  },
  {
    id: "4",
    name: "Emma Wilson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
    role: "Brand Manager",
    lastMessage: "Approved. Let's ship it.",
    time: "Monday",
    unread: 0,
    online: true,
  },
];

const MOCK_MESSAGES = [
  {
    id: "m1",
    senderId: "2",
    text: "Hey, have you seen the initial rough cuts?",
    time: "10:15 AM",
    isMe: false,
  },
  {
    id: "m2",
    senderId: "me",
    text: "Just reviewing them now. The pacing is solid.",
    time: "10:18 AM",
    isMe: true,
    status: "read",
  },
  {
    id: "m3",
    senderId: "2",
    text: "Great. I was thinking we could add some more ambient sound in the intro.",
    time: "10:20 AM",
    isMe: false,
  },
  {
    id: "m4",
    senderId: "me",
    text: "Agreed. Maybe some ocean waves? 🌊",
    time: "10:21 AM",
    isMe: true,
    status: "delivered",
  },
  {
    id: "m5",
    senderId: "2",
    text: "Perfect. I'll pass that to the sound team.",
    time: "10:22 AM",
    isMe: false,
  },
  {
    id: "m6",
    senderId: "2",
    text: "Can we adjust the color grade on the sunset clip?",
    time: "10:23 AM",
    isMe: false,
  },
];

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = React.useState<string | null>("2");
  const [messageInput, setMessageInput] = React.useState("");
  const [messages, setMessages] = React.useState(MOCK_MESSAGES);

  const activeChat = MOCK_CHATS.find(c => c.id === selectedChat);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    const newMessage = {
      id: Math.random().toString(36),
      senderId: "me",
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      status: "sent"
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-white dark:bg-[#1C1C1E] rounded-[32px] border border-[#EBEBEB] dark:border-[#2C2C2E] shadow-sm flex overflow-hidden">
      
      {/* Sidebar - Chat List */}
      <div className="w-80 border-r border-[#EBEBEB] dark:border-[#2C2C2E] flex flex-col bg-[#F5F5F7]/30 dark:bg-black/20">
        {/* Header */}
        <div className="p-6 pb-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white">Messages</h2>
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white dark:bg-[#2C2C2E] shadow-sm hover:bg-[#F5F5F7]">
              <Plus size={18} />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]" size={16} />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#E5E5EA]/50 dark:bg-[#2C2C2E] border-none text-[14px] font-medium placeholder:text-[#8E8E93] outline-none focus:ring-1 focus:ring-black/5 transition-all"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
          {MOCK_CHATS.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={cn(
                "w-full flex items-start gap-3 p-3 rounded-2xl transition-all duration-300 group",
                selectedChat === chat.id 
                  ? "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:bg-[#2C2C2E]" 
                  : "hover:bg-white/50 dark:hover:bg-white/5"
              )}
            >
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#E5E5EA] overflow-hidden flex items-center justify-center">
                  {chat.avatar ? (
                    <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold text-[#8E8E93]">{chat.name[0]}</span>
                  )}
                </div>
                {chat.online && (
                  <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-[#34C759] border-2 border-white dark:border-[#1C1C1E] rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className={cn(
                    "text-[14px] font-semibold truncate pr-2",
                    selectedChat === chat.id ? "text-[#1D1D1F] dark:text-white" : "text-[#1D1D1F]/80 dark:text-white/80"
                  )}>
                    {chat.name}
                  </span>
                  <span className="text-[11px] font-medium text-[#8E8E93] shrink-0">{chat.time}</span>
                </div>
                <p className={cn(
                  "text-[13px] truncate leading-relaxed",
                  chat.unread > 0 
                    ? "font-semibold text-[#1D1D1F] dark:text-white" 
                    : "font-medium text-[#8E8E93] group-hover:text-[#1D1D1F]/70 transition-colors"
                )}>
                  {chat.lastMessage}
                </p>
              </div>
              {chat.unread > 0 && (
                <div className="mt-1.5 shrink-0 w-5 h-5 rounded-full bg-[#007AFF] flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">{chat.unread}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#1C1C1E]">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="h-[72px] px-6 border-b border-[#EBEBEB] dark:border-[#2C2C2E] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E5E5EA] overflow-hidden">
                  {activeChat.avatar ? (
                    <img src={activeChat.avatar} alt={activeChat.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#8E8E93] font-bold">
                      {activeChat.name[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#1D1D1F] dark:text-white leading-none mb-1">
                    {activeChat.name}
                  </h3>
                  <p className="text-[11px] font-medium text-[#8E8E93]">
                    {activeChat.role} • {activeChat.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-[#8E8E93] hover:bg-[#F5F5F7] rounded-full">
                  <Phone size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="text-[#8E8E93] hover:bg-[#F5F5F7] rounded-full">
                  <Video size={18} />
                </Button>
                <div className="w-px h-6 bg-[#EBEBEB] mx-1" />
                <Button variant="ghost" size="icon" className="text-[#8E8E93] hover:bg-[#F5F5F7] rounded-full">
                  <MoreHorizontal size={18} />
                </Button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white dark:bg-[#1C1C1E]">
              {messages.map((msg, i) => {
                const isSequence = i > 0 && messages[i - 1].senderId === msg.senderId;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={cn(
                      "flex flex-col max-w-[70%]",
                      msg.isMe ? "ml-auto items-end" : "items-start"
                    )}
                  >
                    <div 
                      className={cn(
                        "px-5 py-3 text-[15px] leading-relaxed shadow-sm",
                        msg.isMe 
                          ? "bg-[#1D1D1F] text-white rounded-[20px] rounded-br-[4px]" 
                          : "bg-[#F5F5F7] text-[#1D1D1F] rounded-[20px] rounded-bl-[4px] dark:bg-[#2C2C2E] dark:text-white"
                      )}
                    >
                      {msg.text}
                    </div>
                    
                    <div className="flex items-center gap-1.5 mt-1 px-1">
                      <span className="text-[10px] font-medium text-[#8E8E93]">{msg.time}</span>
                      {msg.isMe && msg.status && (
                        <span className="text-[#8E8E93]">
                          {msg.status === "read" && <CheckCheck size={12} className="text-[#34C759]" />}
                          {msg.status === "delivered" && <CheckCheck size={12} />}
                          {msg.status === "sent" && <Check size={12} />}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-[#1C1C1E] border-t border-[#EBEBEB] dark:border-[#2C2C2E]">
              <div className="flex items-end gap-3 max-w-4xl mx-auto">
                <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 rounded-full text-[#8E8E93] hover:bg-[#F5F5F7]">
                  <Plus size={20} />
                </Button>
                <div className="flex-1 bg-[#F5F5F7] dark:bg-[#2C2C2E] rounded-[24px] px-4 py-2 flex items-center gap-3 transition-shadow focus-within:shadow-[0_0_0_2px_rgba(0,0,0,0.05)]">
                  <input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="iMessage..."
                    className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium placeholder:text-[#8E8E93] max-h-32 py-1"
                  />
                  <div className="flex items-center gap-2 text-[#8E8E93]">
                    <button className="hover:text-[#1D1D1F] transition-colors"><ImageIcon size={18} /></button>
                    <button className="hover:text-[#1D1D1F] transition-colors"><Mic size={18} /></button>
                  </div>
                </div>
                <Button 
                  onClick={handleSendMessage}
                  variant="primary" 
                  size="icon" 
                  className={cn(
                    "h-10 w-10 shrink-0 rounded-full shadow-sm transition-all duration-300",
                    messageInput.trim() ? "opacity-100 scale-100" : "opacity-0 scale-90"
                  )}
                >
                  <ArrowUp size={18} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#8E8E93]">
            <div className="w-20 h-20 rounded-full bg-[#F5F5F7] flex items-center justify-center mb-4">
              <MessageSquare size={32} />
            </div>
            <p className="text-lg font-medium text-[#1D1D1F]">No Chat Selected</p>
            <p className="text-sm">Choose a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ArrowUp({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m5 12 7-7 7 7"/>
      <path d="M12 19V5"/>
    </svg>
  );
}

function MessageSquare({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

