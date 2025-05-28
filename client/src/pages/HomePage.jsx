import  { useContext, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import { ChatContext } from "../../context/ChatContext";

const HomePage = () => {
 const {selectedUser}=useContext(ChatContext)

  return (
    <div className="w-full h-screen backdrop-blur-3xl sm:px-[12%] sm:py-[4%]">
      <div
        className={`backdrop-blur-xl border border-gray-400 rounded-lg overflow-hidden h-full grid relative 
          ${
            selectedUser
              ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
              : "grid-cols-1 sm:grid-cols-[1.5fr_1fr]"
          }`}
      >
        <Sidebar />
        <ChatContainer />
        <RightSidebar />
      </div>
    </div>
  );
};

export default HomePage;
