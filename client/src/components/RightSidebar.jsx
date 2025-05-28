import { useContext, useEffect, useState } from "react";
import assets, { imagesDummyData } from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);

  const [msgImages, setMsgImages] = useState([]);

  //Get all images from messages and set them to state
  useEffect(() => {
    setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);
  if (!selectedUser) return null;

  return (
    <div className="bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll max-md:hidden">
      {selectedUser && (
        <>
          {/* User Info Section */}
          <div className="pt-6 flex flex-col items-center gap-3 text-sm mx-auto px-4">
            <img
              src={selectedUser.profilePic || assets.avatar_icon}
              alt="User Avatar"
              className="w-24 h-24 object-cover rounded-full border-2 border-white shadow-md"
            />

            <div className="text-xl font-semibold flex items-center gap-2 text-center">
              {onlineUsers.includes(selectedUser._id) && (
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              )}
              {selectedUser.fullName}
            </div>

            <p className="text-sm text-gray-300 text-center max-w-xs leading-relaxed">
              {selectedUser.bio || "No bio available."}
            </p>
          </div>

          <hr className="border-[#ffffff30] my-5" />
        </>
      )}

      {/* Media Section */}
      <div className="px-5 text-xs">
        <p className="mb-2 font-semibold">Media</p>
        <div className="max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
          {msgImages.map((url, index) => (
            <div
              key={index}
              onClick={() => window.open(url)}
              className="cursor-pointer rounded"
            >
              <img
                src={url}
                alt={`Media ${index + 1}`}
                className="w-full h-auto rounded-md"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={() => logout()}
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-400 to-blue-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default RightSidebar;
