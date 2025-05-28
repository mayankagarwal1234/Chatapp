import { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [input, setInput] = useState("");

  const navigate = useNavigate();

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
    <div
      className={`relative bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
        {/* Logo and menu */}
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40 rounded-lg" />
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 cursor-pointer"
            />

            <div className="absolute top-full right-0 z-20 w-40 p-4 rounded-md bg-[#e2e0e9] border border-gray-600 text-black hidden group-hover:block space-y-2">
              {/* Edit Profile */}
              <div
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 cursor-pointer hover:bg-blue-200 px-2 py-1 rounded-md"
              >
                <img
                  src={assets.pencil_icon}
                  alt="Edit"
                  className="w-4 h-4 object-cover"
                />
                <p className="text-sm">Edit Profile</p>
              </div>

              <hr className="border-t border-gray-400" />

              {/* Logout */}
              <div
                onClick={() => logout()}
                className="flex items-center gap-2 cursor-pointer hover:bg-blue-200 px-2 py-1 rounded-md"
              >
                <img
                  src={assets.logout}
                  alt="Logout"
                  className="w-4 h-4 object-cover"
                />
                <p className="text-sm">Logout</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="bg-[#b2bfcd] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="Search" className="w-3" />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="bg-transparent border-none outline-none text-black text-xs placeholder-[#141414] flex-1"
            placeholder="Search User..."
          />
        </div>

        {/* User List */}
        <div className="flex flex-col mt-4">
          {filteredUsers.map((user, index) => (
            <div
              onClick={() => {
                setSelectedUser(user);

                // Clear unseen messages for this user locally
                setUnseenMessages((prev) => ({
                  ...prev,
                  [user._id]: 0,
                }));
              }}
              key={index}
              className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
                selectedUser?._id === user._id ? "bg-[#282142]/50" : ""
              }`}
            >
              <img
                src={user?.profilePic || assets.avatar_icon}
                alt="avatar"
                className="w-[35px] aspect-[1/1] rounded-full"
              />
              <div className="flex flex-col leading-5">
                <p>{user.fullName}</p>
                {onlineUsers.includes(user._id) ? (
                  <span className="text-green-400 text-xs">Online</span>
                ) : (
                  <span className="text-neutral-400 text-xs">Offline</span>
                )}
              </div>
              {unseenMessages[user._id] > 0 && (
                <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-blue-500/50">
                  {unseenMessages[user._id]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
