import { useContext, useState } from "react";
import assets from "../assets/assets";
import { GeminiContext } from "../../context/GeminiContext";

const ChatLabel = ({
  chatId,
  title = "Untitled Chat",
  openMenu,
  setOpenMenu,
  isActive,
  onClick,
  setRenamedTitles,
}) => {
  const { deleteAiPrompt } = useContext(GeminiContext);
  const [newTitle, setNewTitle] = useState(title);

  const handleToggleMenu = (e) => {
    e.stopPropagation();
    setOpenMenu((prev) =>
      prev.chatId === chatId && prev.open
        ? { open: false, chatId: null }
        : { open: true, chatId }
    );
  };

  const handleRename = async (e) => {
    e.preventDefault();
    const newPrompt = prompt("Enter new title for chat:", newTitle);
    if (!newPrompt) return;

    const trimmed = newPrompt.trim();
    if (trimmed === "" || trimmed === newTitle) return;

    setNewTitle(trimmed);
    setRenamedTitles((prev) => ({
      ...prev,
      [chatId]: trimmed,
    }));
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await deleteAiPrompt({ chatId });
    } catch (error) {
      console.error("Delete error:", error.message);
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-2 text-white/80 rounded-lg text-sm group cursor-pointer relative ${
        isActive ? "bg-white/20" : "hover:bg-white/10"
      }`}
      onClick={onClick}
    >
      {/* Chat title */}
      <p className="truncate w-5/6">{newTitle}</p>

      {/* Options Button */}
      <div
        className="group relative flex items-center justify-center h-6  hover:bg-black/80 rounded-lg w-6"
        onClick={handleToggleMenu}
      >
        <img src={assets.three_dots} alt="Options" className="w-4" />

        {/* Dropdown Menu */}
        {openMenu.open && openMenu.chatId === chatId && (
         <div className="absolute right-0 top-30 translate-x-full -translate-y-full z-[99999] bg-gray-700 rounded-xl w-max p-2 shadow-xl !visible">
            <div
              onClick={handleRename}
              className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg cursor-pointer"
            >
              <img src={assets.pencil_icon} alt="Rename" className="w-4" />
              <p>Rename</p>
            </div>
            <div
              onClick={handleDelete}
              className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg cursor-pointer mt-1"
            >
              <img src={assets.delete_icon} alt="Delete" className="w-4" />
              <p>Delete</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLabel;
