'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Image, Paperclip, MoreHorizontal, Clock, Check, CheckCheck, X, Download, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface MessageChatProps {
  selectedClient: any;
  onClose?: () => void;
}

export default function MessageChat({ selectedClient, onClose }: MessageChatProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load messages from localStorage
    if (selectedClient) {
      const currentUserId = localStorage.getItem('currentUserId');
      if (!currentUserId) return;
      
      const savedMessages = localStorage.getItem(`messages_${currentUserId}_${selectedClient.id}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // If no messages, initialize with empty array
        setMessages([]);
      }
    }
  }, [selectedClient]);

  useEffect(() => {
    // Save messages to localStorage whenever they change
    if (selectedClient && messages.length > 0) {
      const currentUserId = localStorage.getItem('currentUserId');
      if (currentUserId) {
        localStorage.setItem(`messages_${currentUserId}_${selectedClient.id}`, JSON.stringify(messages));
      }
    }
  }, [messages, selectedClient]);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if ((!message.trim() && !selectedImage) || !selectedClient) return;

    setIsLoading(true);

    const newMessage = {
      id: Date.now().toString(),
      content: message.trim(),
      sender: 'dietitian',
      timestamp: new Date().toISOString(),
      isRead: false,
      clientId: selectedClient.id,
      hasImage: !!selectedImage,
      imageUrl: imagePreviewUrl,
      expiresAt: selectedImage ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null // 1 week expiry
    };

    // Add message to state
    setMessages(prev => [...prev, newMessage]);
    
    // Clear input
    setMessage('');
    setSelectedImage(null);
    setImagePreviewUrl(null);
    setShowImagePreview(false);
    
    // Finish loading state after a short delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Dosya boyutu 5MB\'dan küçük olmalıdır.');
        return;
      }
      
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreviewUrl(imageUrl);
      setShowImagePreview(true);
    }
  };

  const cancelImageUpload = () => {
    setSelectedImage(null);
    setImagePreviewUrl(null);
    setShowImagePreview(false);
  };

  const formatMessageTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: tr });
    } catch (error) {
      return 'şimdi';
    }
  };

  if (!selectedClient) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-500">Mesajlaşmak için bir danışan seçin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center">
          {selectedClient.avatar ? (
            <img
              src={selectedClient.avatar}
              alt={selectedClient.firstName}
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
              {selectedClient.firstName?.charAt(0)}{selectedClient.lastName?.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-900">
              {selectedClient.firstName} {selectedClient.lastName}
            </h3>
            <p className="text-xs text-gray-500">
              {selectedClient.lastActive ? `Son görülme: ${formatMessageTime(selectedClient.lastActive)}` : 'Çevrimdışı'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-gray-500">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" className="text-gray-500" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Mesajlaşmaya Başlayın</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-4">
                {selectedClient.firstName} {selectedClient.lastName} ile mesajlaşmaya başlamak için ilk mesajınızı gönderin.
              </p>
              <p className="text-sm text-gray-400">
                Danışanınız mobil uygulamadan mesajlarınızı görebilir ve yanıtlayabilir.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'dietitian' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.sender === 'dietitian'
                      ? 'bg-green-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
                  
                  {msg.hasImage && msg.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={msg.imageUrl}
                        alt="Mesaj görseli"
                        className="rounded max-w-full max-h-60 object-contain cursor-pointer"
                        onClick={() => window.open(msg.imageUrl, '_blank')}
                      />
                      {msg.expiresAt && (
                        <div className="text-xs mt-1 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>
                            {new Date(msg.expiresAt) > new Date() 
                              ? `${formatDistanceToNow(new Date(msg.expiresAt), { locale: tr })} sonra silinecek` 
                              : 'Süresi doldu'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-end mt-1 space-x-1">
                    <span className={`text-xs ${msg.sender === 'dietitian' ? 'text-green-100' : 'text-gray-500'}`}>
                      {formatMessageTime(msg.timestamp)}
                    </span>
                    {msg.sender === 'dietitian' && (
                      msg.isRead ? (
                        <CheckCheck className="w-3 h-3 text-green-100" />
                      ) : (
                        <Check className="w-3 h-3 text-green-100" />
                      )
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Image Preview */}
      {showImagePreview && imagePreviewUrl && (
        <div className="p-2 border-t border-gray-200 bg-gray-50">
          <div className="relative inline-block">
            <img
              src={imagePreviewUrl}
              alt="Yüklenecek görsel"
              className="h-20 rounded border border-gray-300"
            />
            <button
              onClick={cancelImageUpload}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Mesajınızı yazın..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
              rows={2}
            />
            <div className="absolute bottom-2 right-2 flex space-x-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                title="Resim ekle"
              >
                <Image className="w-5 h-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || (!message.trim() && !selectedImage)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <p>Resimler 1 hafta sonra otomatik silinir. Maksimum dosya boyutu: 5MB</p>
        </div>
      </div>
    </div>
  );
}