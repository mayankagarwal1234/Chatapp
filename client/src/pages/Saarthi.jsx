import { useContext, useState } from "react";
import SaarthiSidebar from "../components/SaarthiSidebar";
import SaarthiMain from "../components/SaarthiMain";
import { GeminiContext } from "../../context/GeminiContext.jsx";

const Saarthi = () => {
 const [extended, setExtended] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth > 640; 
    }
    return false; 
  });
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");

  const {
    selectedMessages,
    sendAiPrompt,
    promptHistory, // optional if you store history
  } = useContext(GeminiContext);

  // Ask AI
  const handleAsk = async (e, value) => {
    if (e) e.preventDefault();
    const question = value || prompt;
    if (!question.trim()) return;

    setLoading(true);
    setPrompt("");

    try {
      await sendAiPrompt(question); // uses context API
    } catch (error) {
      console.error("Error sending prompt:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen relative">
      <div
        className={`backdrop-blur-xl border border-white rounded overflow-visible h-full grid transition-all duration-300 ${
          extended ? "grid-cols-[250px_1fr]" : "grid-cols-[90px_1fr]"
        }`}
      >
        <SaarthiSidebar
          extended={extended}
          setExtended={setExtended}
          prompt={prompt}
          setPrompt={setPrompt}
          handleAsk={handleAsk}
        />
        <SaarthiMain
          loading={loading}
          messages={selectedMessages}
          prompt={prompt}
          setPrompt={setPrompt}
          handleAsk={handleAsk}
        />
      </div>
    </div>
  );
};

export default Saarthi;
