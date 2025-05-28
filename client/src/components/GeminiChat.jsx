import { useContext, useEffect, useRef } from "react";
import SaarthiMessage from "../components/SaarthiMessage";
import { GeminiContext } from "../../context/GeminiContext";

const GeminiChat = ({ loading }) => {
  const { selectedMessages } = useContext(GeminiContext);
  const scrollEndRef = useRef(null);

  useEffect(() => {
    if (scrollEndRef.current) {
      scrollEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedMessages, loading]);

  return (
    <div className="max-w-8xl mx-auto p-4 pt-6 mt-10 h-[90vh] flex flex-col relative">
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-2 pb-36 space-y-4">
        {selectedMessages.map((msg, idx) => (
          <SaarthiMessage
            key={idx}
            role={msg.role}
            content={msg.content}
          />
        ))}
        {loading && <SaarthiMessage role="model" content="..." />}
        <div ref={scrollEndRef} />
      </div>
    </div>
  );
};

export default GeminiChat;
