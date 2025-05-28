const backendUrl = import.meta.env.VITE_BACKEND_URL;


export const fetchGeminiReply = async (prompt) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${backendUrl}/api/gemini/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    return data.reply || "No reply received.";
  } catch (error) {
    console.error("Gemini Fetch Error:", error);
    return "Something went wrong while fetching response.";
  }
};

 
  const handleRename = async (e) => {
    e.preventDefault();
    const newPrompt = prompt("Enter new name for chat:", title);
    if (!newPrompt || newPrompt.trim() === "" || newPrompt === title) return;

    try {
      await updateAiPrompt({
        chatId,
        oldPrompt: title,
        newPrompt: newPrompt.trim(),
      });
    } catch (error) {
      console.error("Rename error:", error.message);
    }
  };