import { useContext, useEffect, useState } from "react";
import { GeminiContext } from "../../context/GeminiContext.jsx";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import ChatLabel from "./ChatLabel";

const SaarthiSidebar = ({ extended, setExtended }) => {
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [openMenu, setOpenMenu] = useState({ open: false, chatId: null });
  const [chatInput, setChatInput] = useState("");

  const { chatSessions, selectedChatId, setSelectedChatId, startNewChat } =
    useContext(GeminiContext);

  const [renamedTitles, setRenamedTitles] = useState(() => {
    const saved = localStorage.getItem("renamedTitles");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("renamedTitles", JSON.stringify(renamedTitles));
  }, [renamedTitles]);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setExtended(!extended);
  };

  const handleRename = (chatId, newTitle) => {
    setRenamedTitles((prev) => ({ ...prev, [chatId]: newTitle }));
  };

  const filteredChats = chatSessions.filter((session) => {
    const userPrompt = session.messages.find((m) => m.role === "user");
    const title = userPrompt?.content?.toLowerCase() || "";
    return title.includes(chatInput.toLowerCase());
  });

  return (
    <div
      className={`relative z-50 min-h-screen ${
        extended ? "max-w-[250px]" : "max-w-[85px]"
      }  bg-blue-300/10 text-white inline-flex flex-col justify-between p-5 rounded-r-md transition-all duration-300 overflow-visible`}
    >
      <div className="space-y-8 overflow-visible max-h-full">
        {/* Header */}
        <div className="flex items-center justify-between w-full relative">
          {/* Logo */}
          <img
            src={assets.saarthi}
            alt="Logo"
            className="w-10 h-10 cursor-pointer"
            onClick={() => setExtended(true)}
          />

          {/* Sidebar Close Icon + Tooltip */}
          {extended && (
            <div
              className="relative"
              onMouseEnter={() => setHoveredIcon("close")}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <img
                src={assets.sidebar_close}
                alt="Close"
                className="w-7 h-7 cursor-pointer"
                onClick={toggleSidebar}
              />
              {hoveredIcon === "close" && (
                <div className="absolute top-18 -left-1/1 -translate-x-1/2 -translate-y-10 bg-white text-black text-xs px-2 py-1 rounded-md shadow-lg z-50 whitespace-nowrap">
                  Close Sidebar
                </div>
              )}
            </div>
          )}
        </div>

        {/* Open Sidebar Button (Mini Mode) */}
        {!extended && (
          <div
            className="w-fit relative"
            onMouseEnter={() => setHoveredIcon("open")}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            <img
              src={assets.sidebar_open}
              alt="Open Sidebar"
              className="w-8 h-8 cursor-pointer"
              onClick={toggleSidebar}
            />
            {hoveredIcon === "open" && (
              <div className="fixed flex top-32 left-1/15 -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded-md z-[9999] shadow-lg whitespace-nowrap">
                Open Sidebar
              </div>
            )}
          </div>
        )}

        {/* New Chat Button */}
        <div
          onClick={startNewChat}
          onMouseEnter={() => setHoveredIcon("chat")}
          onMouseLeave={() => setHoveredIcon(null)}
          className={`${
            extended
              ? "mt-12 flex items-center gap-2 p-2 px-3 rounded-xl max-w-[160px] bg-white/100 hover:bg-[#a1b3cc]"
              : "mt-20"
          } text-black cursor-pointer transition-all`}
          role="button"
          tabIndex={0}
        >
          <img
            src={extended ? assets.plus_icon : assets.chat_icon}
            alt="New Chat"
            className={extended ? "w-4 h-6" : "w-10 h-10 opacity-70"}
          />

          {extended && <p className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-400">New Chat</p>}
          {!extended && hoveredIcon === "chat" && (
            <div className="fixed flex top-45 left-1/30 -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded-md z-[9999] shadow-lg whitespace-nowrap">
              New Chat
            </div>
          )}
        </div>

        {/* Chat List */}
        {extended && (
          <>
            {/* Search bar */}
            <div className="bg-white/50 rounded-md flex items-center gap-2 py-3 px-4 mt-5">
              <img src={assets.search_icon} alt="Search" className="w-3" />
              <input
                type="text"
                className="bg-transparent border-none outline-none text-black text-xs placeholder-[#141414] flex-1"
                placeholder="Search Chat..."
                onChange={(e) => setChatInput(e.target.value)}
              />
            </div>

            <div className="space-y-3 mt-6">
              <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                Recent
              </p>

              {filteredChats.length === 0 ? (
                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-[#282142]/50 cursor-pointer transition">
                  <img
                    src={assets.message_icon}
                    alt="Msg"
                    className="w-6 h-6"
                  />
                  <p className="text-sm">No chats yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {[...filteredChats].reverse().map((session) => {
                    const userPrompt = session.messages.find(
                      (m) => m.role === "user"
                    );
                    const originalTitle =
                      userPrompt?.content?.slice(0, 30) || "Untitled Chat";
                    return (
                      <ChatLabel
                        key={session.chatId}
                        chatId={session.chatId}
                        title={renamedTitles[session.chatId] || originalTitle}
                        setRenamedTitles={setRenamedTitles}
                        openMenu={openMenu}
                        setOpenMenu={setOpenMenu}
                        onClick={() => setSelectedChatId(session.chatId)}
                        isActive={session.chatId === selectedChatId}
                        onRename={(newTitle) =>
                          handleRename(session.chatId, newTitle)
                        }
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer App Info */}
      <div
        className={`${
          extended
            ? "flex items-center gap-3 p-2"
            : "flex items-center justify-center mt-16"
        } cursor-pointer`}
        onClick={() => navigate("/")}
        role="button"
        tabIndex={0}
        onMouseEnter={() => setHoveredIcon("chatapp")}
        onMouseLeave={() => setHoveredIcon(null)}
      >
        <img
          src={assets.logo_icon}
          alt="Chatapp"
          className="relative w-7 h-7 sm:w-10 sm:h-10 opacity-80"
        />
        {extended && <p className="text-lg text-white font-medium">Chatapp</p>}
        {hoveredIcon === "chatapp" && (
          <div className="absolute bottom-15 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded-md z-50">
            Chatapp
          </div>
        )}
      </div>
    </div>
  );
};

export default SaarthiSidebar;
