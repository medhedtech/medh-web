"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, MessageCircle, Phone, Mail, Clock, User, Bot, Paperclip, Smile } from "lucide-react";
import { motion } from "framer-motion";
import { buildAdvancedComponent, getResponsive, getEnhancedSemanticColor } from "@/utils/designSystem";

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  isTyping?: boolean;
}

const LiveChatPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [supportAgent, setSupportAgent] = useState({
    name: "Sarah",
    status: "online",
    avatar: "👩‍💼"
  });
  const [chatStatus, setChatStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate connecting to chat
    setTimeout(() => {
      setIsConnected(true);
      setChatStatus('connected');
      
      // Add welcome message
      setMessages([
        {
          id: '1',
          text: `Hi! I'm ${supportAgent.name}, your dedicated support agent. How can I help you today?`,
          sender: 'support',
          timestamp: new Date()
        }
      ]);
    }, 2000);

    return () => {
      setIsConnected(false);
      setChatStatus('disconnected');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !isConnected) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");

    // Simulate support agent typing
    const typingMessage: ChatMessage = {
      id: 'typing',
      text: '',
      sender: 'support',
      timestamp: new Date(),
      isTyping: true
    };

    setMessages(prev => [...prev, typingMessage]);

    // Simulate response delay
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      
      const responses = [
        "I understand your concern. Let me help you with that.",
        "That's a great question! Here's what you need to know...",
        "I can definitely help you with that. Let me check your account details.",
        "Thank you for reaching out. I'll assist you right away.",
        "I see what you're asking about. Let me provide you with the information you need."
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const supportMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'support',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, supportMessage]);
    }, 2000 + Math.random() * 2000); // Random delay between 2-4 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBack = () => {
    router.push('/dashboards/student/profile');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-6xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className={buildAdvancedComponent.glassCard({ variant: 'primary', hover: false })}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className={getResponsive.fluidText('heading')}>
                    Live Chat Support
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Get instant help from our support team
                  </p>
                </div>
              </div>
            </div>
            
            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                chatStatus === 'connected' ? 'bg-green-500' : 
                chatStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {chatStatus === 'connected' ? 'Connected' : 
                 chatStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>

        {/* Support Agent Info */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 px-6 py-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-lg">
                  {supportAgent.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {supportAgent.name} (Support Agent)
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {supportAgent.status === 'online' ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-xs text-blue-700 dark:text-blue-300">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>Response time: ~2-3 min</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 p-4">
          {!isConnected ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Connecting to support...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  } rounded-lg px-4 py-2 shadow-sm`}>
                    {message.isTyping ? (
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs ml-2">typing...</span>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' 
                            ? 'text-blue-100' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {isConnected && (
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-xs text-gray-600 dark:text-gray-400">Quick actions:</span>
              <button className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                Course Help
              </button>
              <button className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                Technical Issue
              </button>
              <button className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                Payment
              </button>
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isConnected ? "Type your message..." : "Connecting to support..."}
                disabled={!isConnected}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                disabled={!isConnected}
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                disabled={!isConnected}
              >
                <Smile className="w-5 h-5" />
              </button>
              <motion.button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !isConnected}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Alternative Contact Methods */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            Need immediate assistance? Try these alternatives:
          </p>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center text-blue-600 dark:text-blue-400">
              <Phone className="w-3 h-3 mr-1" />
              <span>Call: +1 (555) 123-4567</span>
            </div>
            <div className="flex items-center text-blue-600 dark:text-blue-400">
              <Mail className="w-3 h-3 mr-1" />
              <span>Email: support@medh.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChatPage;
