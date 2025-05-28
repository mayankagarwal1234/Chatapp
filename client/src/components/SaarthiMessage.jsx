import { useEffect, useState, useContext, useRef } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import toast from "react-hot-toast";
import { GeminiContext } from "../../context/GeminiContext";
import { AuthContext } from "../../context/AuthContext";

const SaarthiMessage = ({ role, content,onUpdate }) => {
  const isUser = role === "user";
 const { updateAiPrompt,getChatIdByUserMessage } = useContext(GeminiContext);
  const [displayedContent, setDisplayedContent] = useState(isUser ? content : "");
  const [index, setIndex] = useState(0);
  const { authUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [oldContent, setOldContent] = useState(content);

  const textRef = useRef(null);
  const textareaRef = useRef(null);



  const handleCopy = () => {
    if (textRef.current) {
      navigator.clipboard
        .writeText(textRef.current.innerText)
        .then(() => toast.success("Copied to clipboard!"))
        .catch((err) => toast.error("Copy failed: " + err.message));
    }
  };

  const handleEditClick = () => {
    if (isUser) {
      setIsEditing(true);
      setEditContent(displayedContent);
      setOldContent(displayedContent);
    }
  };


 const saveEdit = async () => {
  if (editContent.trim() === "") {
    toast.error("Content cannot be empty");
    return;
  }

  setDisplayedContent(editContent);
  setIsEditing(false);

  if (editContent !== oldContent) {
    const chatId = getChatIdByUserMessage(oldContent); 
    if (!chatId) {
      toast.error("Unable to identify the chat session.");
      return;
    }

    try {
      onUpdate?.({
        chatId,
        oldContent,
        newContent: editContent.trim(),
      });
    } catch (error) {
      console.error("Rename error:", error.message);
      toast.error("Failed to update prompt.");
    }
  }
};


const handleRename = async () => {
  if (!editContent || editContent.trim() === "" || editContent === oldContent) return;

  const chatId = getChatIdByUserMessage(oldContent); 

  if (!chatId) {
    toast.error("Unable to find chat ID for this message.");
    return;
  }

  try {
    await updateAiPrompt({
      chatId,
      oldPrompt: oldContent,
      newPrompt: editContent.trim(),
    });
  } catch (error) {
    console.error("Rename error:", error.message);
  }
};


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
      handleRename()
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setEditContent(oldContent);
    }
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (isUser) {
      setDisplayedContent(content);
      setIndex(content.length);
      setEditContent(content);
      setOldContent(content);
    } else {
      setDisplayedContent("");
      setIndex(0);
    }
  }, [content, role]);

 useEffect(() => {
  if (isUser) {
    // User messages display immediately
    setDisplayedContent(content);
    setIndex(content.length);
    setOldContent(content);
    setEditContent(content);
    return;
  }

  // For AI messages, animate only new part
  let isCancelled = false;
  const previousLength = displayedContent.length;

  // If content got shorter or equal, just replace immediately
  if (content.length <= previousLength) {
    setDisplayedContent(content);
    setIndex(content.length);
    return;
  }

  // Start animation from where we left off
  setIndex(previousLength);

  const animate = (i) => {
    if (isCancelled) return;

    if (i <= content.length) {
      setDisplayedContent(content.slice(0, i));
      setTimeout(() => animate(i + 1), 10); // 10 ms per char, adjust speed here
    }
  };

  animate(previousLength + 1);

  return () => {
    isCancelled = true;
  };
}, [content, isUser]);


  return (
    <div className={`flex mb-4 px-4 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative group p-3 sm:max-w-[350px] md:max-w-[400px] lg:max-w-[500px] xl:max-w-[600px]text-sm font-light rounded-lg break-words whitespace-pre-wrap backdrop-blur-md ${
          isUser
            ? "bg-blue-500/30 text-white rounded-br-none"
            : "bg-white/100 text-black rounded-bl-none"
        }`}
      >
        <img
          src={isUser ? authUser?.profilePic || assets.avatar_icon : assets.saarthi}
          alt={isUser ? "User" : "Saarthi"}
          className="absolute -top-2 -left-10 translate-x-1/2 -translate-y-1/2 h-7 w-7 rounded-full border border-white/30 shadow-sm bg-white"
        />

        <div className="opacity-0 group-hover:opacity-100 absolute -bottom-5 right-0 z-10 transition-opacity duration-300">
          <div className="flex items-center gap-2 opacity-70">
            <img
              src={assets.copy_icon}
              alt="Copy"
              className="w-4 cursor-pointer hover:opacity-90"
              onClick={handleCopy}
            />
            {isUser ? (
              <img
                src={assets.pencil_icon}
                alt="Edit"
                className="w-4 cursor-pointer hover:opacity-90"
                onClick={handleEditClick}
              />
            ) : (
              <img
                src={assets.regenerate}
                alt="Regenerate"
                className="w-4 cursor-pointer hover:opacity-90"
              />
            )}
          </div>
        </div>

        <div className="space-y-2 w-full whitespace-pre-line">
          {isEditing ? (
            <textarea
              ref={textareaRef}
              className="w-full rounded-md p-2 text-black resize-none"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onBlur={saveEdit}
              onKeyDown={handleKeyDown}
              rows={Math.min(10, editContent.split("\n").length)}
            />
          ) : (
            <div ref={textRef}>{displayedContent}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SaarthiMessage;
