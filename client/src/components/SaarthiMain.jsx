import { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { GeminiContext } from "../../context/GeminiContext";
import SaarthiMessage from "../components/SaarthiMessage";

const SaarthiMain = ({ loading, prompt, setPrompt, handleAsk }) => {
  const { authUser, logout } = useContext(AuthContext);

  const { selectedMessages } = useContext(GeminiContext);
  const navigate = useNavigate();
  const scrollEnd = useRef();

  const [hoveredIcon, setHoveredIcon] = useState(null);

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedMessages, loading]);

  const suggestionCards = [
    {
      text: "Suggest beautiful places to see on an upcoming road trip",
      icon: assets.compass_icon,
    },
    {
      text: "Briefly summarize this concept: urban planning",
      icon: assets.bulb_icon,
    },
    {
      text: "Brainstorm team bonding activities for our work retreat",
      icon: assets.message_icon,
    },
    {
      text: "Improve the readability of the following code",
      icon: assets.code_icon,
    },
  ];

  return (
    <div className="flex flex-col bg-blue-400/15 h-screen text-black relative">
      {/* Scrollable Main Content */}
      <div
        className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-12 pt-6 pb-40"
        style={{
          backdropFilter: "blur(20px)",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <p className="text-xl sm:text-2xl font-bold text-white/30 hover:scale-105 hover:text-white transition-all duration-300">
            Saarthi
          </p>
          <div className="flex items-center gap-3">
            <img
              onClick={() => navigate("/profile")}
              src={authUser?.profilePic || assets.avatar_icon}
              alt="User"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer"
            />
            <div className="relative flex items-center justify-center">
              <img
                onClick={logout}
                onMouseEnter={() => setHoveredIcon("Logout")}
                onMouseLeave={() => setHoveredIcon(null)}
                src={assets.logout}
                alt="Logout"
                className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
              />
              {hoveredIcon === "Logout" && (
                <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded-md shadow z-50 whitespace-nowrap">
                  Logout
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Greeting */}
        <div className="ml-1 sm:ml-4 mb-6 sm:mb-8">
          <p className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-200">
              Hello, {authUser?.fullName || "Dev"}
            </span>
          </p>
          <p className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl mt-2 font-medium text-gray-800 hover:scale-105 hover:text-gray-900 transition-all ml-1">
            How can I help you today?
          </p>
        </div>

        {/* Suggestion Cards OR Messages */}
        {selectedMessages.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:h-45 gap-4 sm:gap-6">
            {suggestionCards.map((card, index) => (
              <div
                key={index}
                onClick={() => handleAsk(null, card.text)}
                className="relative bg-white/30 backdrop-blur-lg p-4 rounded-xl border border-white/30 shadow-md cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:border-blue-300"
              >
                <p className="text-sm md:text-md lg:text-lg sm:text-base text-gray-800 mb-4 pr-6">
                  {card.text}
                </p>
                <img
                  src={card.icon}
                  alt="icon"
                  className="w-5 h-5 sm:w-6 sm:h-6 absolute bottom-4 right-4"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex mt-6 flex-col gap-6">
            {selectedMessages.map((msg, idx) => (
              <SaarthiMessage
                key={idx}
                role={msg.role}
                content={msg.content}
                onUpdate={async ({ chatId, oldContent, newContent }) => {
                  try {
                    console.log({ chatId, oldContent, newContent });
                  } catch (error) {
                    console.error("Rename error:", error.message);
                  }
                }}
              />
            ))}

            {loading && <SaarthiMessage role="model" content="..." />}
          </div>
        )}
        <div ref={scrollEnd}></div>
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleAsk}
        className="absolute bottom-0 left-0 right-0 z-10 px-2 sm:px-4 py-2 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto flex rounded-xl px-4 py-1 bg-[#f6f7f9] shadow-inner border border-gray-300">
          <div className="relative w-full">
            <textarea
              lg:rows={3} 
              sm:rows={2}
              placeholder="Ask Saarthi..."
              className="w-full resize-none bg-transparent outline-none text-sm sm:text-base text-gray-800 pr-10 pb-10"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAsk(e);
                }
              }}
            />

            {/* Send Button in Bottom-Right */}
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className={`absolute bottom-2 right-0 ${
                prompt.trim() ? "bg-blue-500" : "bg-gray-400 cursor-not-allowed"
              } w-9 h-9 flex items-center justify-center rounded-full transition`}
            >
              <img src={assets.arrow} alt="Send" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SaarthiMain;
