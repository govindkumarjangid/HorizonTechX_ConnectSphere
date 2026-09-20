import React, { useState, useCallback } from 'react';
import {
  Search,
  Send,
  Smile,
  Paperclip,
  CheckCheck,
  ArrowLeft,
  Info,
} from 'lucide-react';
import Avatar from '../components/users/Avatar';
import { mockConversations } from '../utils/mockData';

const MessageComposer = React.memo(({ onSendMessage }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setText('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-2.5 sm:p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 sm:gap-2 bg-white dark:bg-slate-900 flex-shrink-0"
    >
      <button
        type="button"
        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        aria-label="Attach file"
      >
        <Paperclip className="w-4 h-4" />
      </button>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 h-10 px-3.5 sm:px-4 rounded-full bg-slate-100 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
      />
      <button
        type="button"
        className="p-2 text-slate-400 hover:text-amber-500 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        aria-label="Insert emoji"
      >
        <Smile className="w-4 h-4" />
      </button>
      <button
        type="submit"
        disabled={!text.trim()}
        className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0 cursor-pointer"
        aria-label="Send message"
      >
        <Send className="w-4 h-4 -translate-x-0.5 translate-y-0.5" />
      </button>
    </form>
  );
});

export const Messages = () => {
  const [conversations, setConversations] = useState(mockConversations);
  const [activeConvId, setActiveConvId] = useState(mockConversations[0]?.id);
  const [searchFilter, setSearchFilter] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const activeConversation = conversations.find((c) => c.id === activeConvId);

  const filteredConversations = conversations.filter(
    (c) =>
      c.user.fullName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.user.username.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleSendMessage = useCallback(
    (text) => {
      if (!text || !activeConvId) return;

      const newMsg = {
        id: `m_${Date.now()}`,
        senderId: 'usr_me',
        text,
        time: 'Just now',
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConvId) {
            return {
              ...c,
              messages: [...c.messages, newMsg],
              lastMessage: newMsg.text,
              lastTimestamp: 'Just now',
            };
          }
          return c;
        })
      );
    },
    [activeConvId]
  );

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden h-[calc(100dvh-8rem)] md:h-[calc(100vh-140px)] min-h-[420px] md:min-h-[540px] flex transition-colors">
      {/* Column 1: Conversation List */}
      <div
        className={`w-full md:w-80 lg:w-88 border-r border-slate-200/80 dark:border-slate-800 flex flex-col ${
          activeConvId ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">
            Direct Messages
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search conversations..."
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* List of chats */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredConversations.map((c) => {
            const isSelected = c.id === activeConvId;
            return (
              <div
                key={c.id}
                onClick={() => setActiveConvId(c.id)}
                className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-blue-50/70 dark:bg-blue-950/30'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Avatar src={c.user.avatar} alt={c.user.fullName} size="md" isOnline />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {c.user.fullName}
                    </span>
                    <span className="text-[10px] text-slate-400 flex-shrink-0">
                      {c.lastTimestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {c.lastMessage}
                  </p>
                </div>
                {c.unreadCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {c.unreadCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Column 2: Active Chat Thread */}
      {activeConversation ? (
        <div
          className={`flex-1 flex flex-col ${
            !activeConvId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Chat Header */}
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveConvId(null)}
                className="md:hidden p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <Avatar
                src={activeConversation.user.avatar}
                alt={activeConversation.user.fullName}
                size="md"
                isOnline
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {activeConversation.user.fullName}
                </h3>
                <p className="text-[11px] text-slate-400">
                  Active now
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Conversation info"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-slate-900/30">
            {activeConversation.messages.map((msg) => {
              const isMine = msg.senderId === 'usr_me';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] sm:max-w-md rounded-2xl px-4 py-2.5 text-xs sm:text-sm ${
                      isMine
                        ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 rounded-bl-xs'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                        isMine ? 'text-blue-200' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.time}</span>
                      {isMine && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Composer */}
          <MessageComposer onSendMessage={handleSendMessage} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          Select a conversation to start messaging
        </div>
      )}

      {/* Column 3: Context/Info Panel (Togglable) */}
      {showInfo && activeConversation && (
        <div className="w-72 border-l border-slate-200/80 dark:border-slate-800 p-5 hidden lg:flex flex-col items-center text-center space-y-4">
          <Avatar
            src={activeConversation.user.avatar}
            alt={activeConversation.user.fullName}
            size="xl"
          />
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              {activeConversation.user.fullName}
            </h4>
            <p className="text-xs text-slate-400">
              @{activeConversation.user.username}
            </p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {activeConversation.user.bio}
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;
