import { AuthContext } from "./AuthContext";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const GeminiContext = createContext();

export const GeminiProvider = ({ children }) => {
  const [chatSessions, setChatSessions] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(" ");

  const { axios ,authUser,loading} = useContext(AuthContext);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        token: token,
      },
    };
  };
  

  // ✅ Fetch chat history
  const fetchAiMessages = async () => {
     if (!authUser) return; // safety check

    try {
      const prevSelectedId = selectedChatId; // ✅ store current selection

      const { data } = await axios.get(
        "/api/gemini/getchats",
        getAuthHeaders()
      );

      if (data.success && data.chats.length > 0) {
        setChatSessions(data.chats);

        // ✅ preserve selection if it still exists
        const stillExists = data.chats.find(
          (chat) => chat.chatId === prevSelectedId
        );
        if (stillExists) {
          setSelectedChatId(prevSelectedId);
        } else {
          setSelectedChatId(data.chats[0].chatId);
        }
      } else {
        setChatSessions([]);
        setSelectedChatId(null);
      }
    } catch (error) {
      toast.error("Failed to load AI chat history.");
    }
  };

   useEffect(() => {
    if (!loading && authUser) {
      fetchAiMessages();
    }
  }, [loading, authUser]);


  // ✅ Send prompt
  const sendAiPrompt = async (prompt) => {
    try {
      const payload = selectedChatId
        ? { prompt, chatId: selectedChatId }
        : { prompt };

      const { data } = await axios.post("/api/gemini/chat", payload, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (data.reply) {
        const newMsgPair = [
          { role: "user", content: prompt },
          { role: "model", content: data.reply },
        ];

        if (
          !selectedChatId ||
          !chatSessions.find((s) => s.chatId === data.chatId)
        ) {
          const newSession = {
            chatId: data.chatId,
            messages: newMsgPair,
          };
          setChatSessions((prev) => [...prev, newSession]);
          setSelectedChatId(data.chatId);
        } else {
          setChatSessions((prev) =>
            prev.map((session) =>
              session.chatId === data.chatId
                ? { ...session, messages: [...session.messages, ...newMsgPair] }
                : session
            )
          );
        }
      }
    } catch (error) {
      toast.error("Failed to send prompt.");
    }
  };

  // ✅ Start new chat
  const startNewChat = () => {
    setSelectedChatId(null);
  };

  const updateAiPrompt = async (body) => {
    try {
      const { data } = await axios.patch("/api/gemini/updatechat", body, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (data.success) {
        toast.success("Prompt updated successfully.");
        fetchAiMessages();
      }
    } catch (error) {
      toast.error("Failed to update prompt.");
      console.error(error.response?.data || error.message);
    }
  };

  const deleteAiPrompt = async (body) => {
    try {
      const { data } = await axios.delete("/api/gemini/deletechat", {
        headers: {
          token: localStorage.getItem("token"), // or use getAuthHeaders() if needed
        },
        data: body,
      });

      if (data.success) {
        toast.success("Prompt deleted successfully.");
        fetchAiMessages();
      }
    } catch (error) {
      toast.error("Failed to delete prompt.");
      console.error(error.response?.data || error.message);
    }
  };

  const getChatIdByUserMessage = (message) => {
    for (const session of chatSessions) {
      const userMessage = session.messages.find(
        (msg) => msg.role === "user" && msg.content === message
      );
      if (userMessage) {
        return session.chatId;
      }
    }
    return null; // If no match is found
  };

  useEffect(() => {
    fetchAiMessages();
  }, []);

  const selectedMessages =
    chatSessions.find((s) => s.chatId === selectedChatId)?.messages || [];

  //const sessionChatId = chatSessions.find((s) => s.chatId)?.chatId;

  const value = {
    chatSessions,
    selectedChatId,
    setSelectedChatId,
    selectedMessages,
    sendAiPrompt,
    updateAiPrompt,
    deleteAiPrompt,
    startNewChat,
    // sessionChatId,
    getChatIdByUserMessage,
  };

  return (
    <GeminiContext.Provider value={value}>{children}</GeminiContext.Provider>
  );
};
