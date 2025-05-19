import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Loading from "./Loading";

export default function ChatbotWidget({ onClose }) {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleChange = (e) => setQuestion(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!question.trim()) return;
    setChatHistory((prev) => [...prev, { sender: "user", text: question }]);
    setQuestion("");
    try {
      const res = await axios.post("http://localhost:3000/chat", {
        question,
      });
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", text: res.data.data || res.data.message },
      ]);
    } catch (err) {
      let errorMessage = "Server Busy!!";
      if (err.response) {
        if (err.response.status !== 500) {
          errorMessage = err.response.data.message || err.message;
        }
      } else {
        errorMessage = err.message;
      }

      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", text: errorMessage },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) handleSubmit(e);
  };

  return (
    <div
      className="fixed bottom-24 right-8 w-[300px] h-[400px] bg-white rounded-xl shadow-2xl flex flex-col z-[1001] border text-xs"
      style={{ minWidth: 300 }}
    >
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <span className="font-bold text-lg">Ortus Chatbot</span>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 text-2xl font-bold"
        >
          &times;
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-2">
        {chatHistory.length === 0 && (
          <div className="text-gray-400 text-center mt-4">
            No messages yet. Start the conversation!
          </div>
        )}
        {chatHistory.map((chat, idx) => (
          <div
            key={idx}
            className={`flex ${
              chat.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg shadow
                ${
                  chat.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                } max-w-[75%] break-words`}
            >
              {typeof chat.text === "object" ? (
                Array.isArray(chat.text) ? (
                  chat.text.map((item, i) => (
                    <div key={i}>
                      {Object.entries(item).map(([key, value]) => (
                        <div key={key}>
                          <b>{key}:</b> {String(value)}
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  Object.entries(chat.text).map(([key, value]) => (
                    <div key={key}>
                      <b>{key}:</b> {String(value)}
                    </div>
                  ))
                )
              ) : (
                <span>{chat.text}</span>
              )}
            </div>
          </div>
        ))}
        {loading && <Loading />}
        <div ref={chatEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center px-1.5 py-2 border-t"
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={question}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="flex-1 border border-gray-300 rounded-l-md px-1 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="group inline-flex items-center justify-center w-10 h-8 bg-gradient-to-r bg-blue-700 text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
          aria-label="Send"
        >
          <svg
            className="w-6 h-6 stroke-current transition-transform duration-300 ease-in-out group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </form>
    </div>
  );
}
