import { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

   const [hoveredIcon, setHoveredIcon] = useState(null);
  const scrollEnd = useRef();
  const [input, setInput] = useState("");

  //Handling sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendMessage({ text: input.trim() });
    setInput("");
  };
  //Handle sending a image
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const navigate = useNavigate();
  
  const handleSaarthiClick = () => {
  if (window.innerWidth < 640) {
    navigate("/saarthi");
  }
};

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return selectedUser ? (
    <div className="h-full overflow-hidden relative backdrop-blur-lg ">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-gray-400">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="avatar"
          className="w-8 h-8 object-cover rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
        <img
          src={assets.arrow_icon}
          alt="Back"
          className="md:hidden w-7 cursor-pointer active invert"
          onClick={() => {
            navigate("/");
            setSelectedUser(null);
          }}
        />
        <div
          onClick={() => navigate("/saarthi")}
          className="relative cursor-pointer text-sm flex items-center gap-2 max-md:hidden w-fit "
        >
          <img
           onMouseEnter={() => setHoveredIcon("logo")}
           onMouseLeave={() => setHoveredIcon(null)}
            src={assets.saarthi}
            alt="Saarthi Logo"
            className="w-8 h-8 object-cover rounded-full"
          />
           {hoveredIcon === "logo" && (
                  <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded-md z-50">
                    Saarthi
                  </div>
                )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg, index) => {
          const isSender = msg.senderId === authUser._id;
          return (
            <div
              className={`flex items-end gap-2 mb-4 ${
                isSender ? "justify-end" : "justify-start"
              }`}
              key={index}
            >
              {!isSender && (
                  <div className="text-center text-xs">
                    <img
                      src={selectedUser?.profilePic || assets.avatar_icon}
                      alt="avatar"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <p className="text-gray-500">
                      {msg.createdAt ? formatMessageTime(msg.createdAt) : ""}
                    </p>
                  </div>
                )}
              {/* Message bubble */}
              {msg.image ? (
                <img
                  src={msg.image}
                  alt="sent"
                  className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
                />
              ) : (
                <p
                  className={`p-2 max-w-[230px] md:text-sm font-light rounded-lg mb-8 break-all text-white ${
                    msg.senderId === authUser._id
                      ? "bg-blue-500/100 text-black rounded-br-none"
                      : "bg-gray-500/50 text-black rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </p>
              )}

              {/* Avatar and timestamp */}
              {isSender && <div className="text-center text-xs">
                <img
                  src={
                     authUser?.profilePic || assets.avatar_icon
                  }
                  alt="avatar"
                  className="w-7 h-7 object-cover rounded-full"
                />
                <p className="text-gray-500">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>}
            </div>
          );
        })}
        {/* Scroll anchor */}
        <div ref={scrollEnd}></div>
      </div>

      {/* Bottom Area */}

      <div className=" absolute bottom-0 left-0 right-0 flex items-center gap-1 p-3">
        <div className="flex-1 flex items-center bg-[#b2bfcd] px-3 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-black placeholder-black-400"
          />
           <img
           onClick={handleSaarthiClick}
              src={assets.saarthi}
              alt=""
              className="md:hidden w-7 h-7 mr-2 cursor-pointer"
            />
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png,image/jpeg,image/jpg"
            hidden
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt=""
              className="w-5 mr-1 cursor-pointer"
            />
          </label>
        </div>
        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt=""
          className="w-7 p-1 cursor-pointer"
        />
      </div>
    </div>
  ) : (
    //for saarthi ai integrate here
    <div
      className={`flex flex-col items-center justify-center gap-4 rounded-md backdrop-blur-md max-sm:hidden bg-white/10 w-full h-full text-center shadow-lg relative p-4`}
    >
        {/* Top logo and text */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <img
            src={assets.saarthi}
            alt="logo"
            className="w-12 h-12 rounded-lg"
          />
          <span className=" text-3xl font-semibold text-white tracking-wide">Saarthi</span>
        </div>

        {/* Center robot image */}
        <div className="flex flex-col items-center justify-center mt-2">
          <img
            src={assets.robot}
            alt="Robot"
            className="w-80 h-80 object-contain "
          />
          <p className="text-lg sm:text-xl font-bold text-white tracking-wide text-center">
           Not Just Chat. It's Chat + AI
          </p>
        </div>
    </div>
  );
};

export default ChatContainer;
