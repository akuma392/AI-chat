import React, { useState, useContext } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { AuthContext } from "../contextApi/AuthContext";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const Home = () => {
  const [query, setQuery] = useState(""); // User input
  const [messages, setMessages] = useState([]); // Chat messages (user + AI)
  const [loading, setLoading] = useState(false); // Loading state

  const { authState } = useContext(AuthContext);

  const handleSendMessage = async () => {
    if (!query.trim()) return; // Prevent empty messages

    // Add user message to messages
    const newMessages = [...messages, { sender: "user", text: query }];
    setMessages(newMessages);

    try {
      setLoading(true);

      const prompt = query;
      const response = await model.generateContent(prompt);

      // Add AI response to messages
      setMessages([
        ...newMessages,
        { sender: "bot", text: response.response.text() },
      ]);
      setQuery("");
    } catch (error) {
      console.error("Error fetching OpenAI response:", error);
      setMessages([
        ...newMessages,
        {
          sender: "bot",
          text: "Oops! Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex flex-column"
      style={{
        height: "65vh", // Full viewport height
        boxSizing: "border-box",
      }}
    >
      {/* Chat Messages (Scrollable Area) */}
      <div
        className="flex-grow-1 overflow-auto p-3 border m-3"
        style={{
          background: "#f9f9f9",
          borderRadius: "8px",
          marginBottom: "0", // Prevent margin from pushing into the input area
        }}
      >
        {messages.length === 0 ? (
          <p className="text-muted">Start a conversation with ChatGPT!</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 my-2 text-center ${
                msg.sender === "user" ? "text-lg-end" : "text-lg-start"
              }`}
            >
              <div
                className={`d-inline-block p-2 rounded ${
                  msg.sender === "user"
                    ? "bg-primary text-white"
                    : "bg-secondary text-light"
                }`}
                style={{ maxWidth: "70%" }}
              >
                {msg.sender === "user" ? (
                  <div>{msg.text}</div>
                ) : (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat Input (Fixed at the Bottom) */}
      <div
        className="p-3 bg-light"
        style={{
          borderTop: "1px solid #ddd",
          position: "sticky", // Stick to the bottom
          bottom: 0,
          width: "100%",
        }}
      >
        {authState.isAuthenticated ? (
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type your message..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={loading}
            />
            <button
              className="btn btn-primary"
              onClick={handleSendMessage}
              disabled={loading || !query.trim()}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        ) : (
          <p>Please login to continue....</p>
        )}
      </div>
    </div>
  );
};

export default Home;
