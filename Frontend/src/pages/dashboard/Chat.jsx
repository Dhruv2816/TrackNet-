import React, { useState, useRef, useEffect } from "react";
import {
  Typography,
  Card,
  Input,
  Button,
  Alert,
  Spinner,
} from "@material-tailwind/react";

export function Chat() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]); // { type: 'user' | 'bot', content: string }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    if (!query.trim()) return;

    const newUserMessage = { type: "user", content: query };
    setMessages((prev) => [...prev, newUserMessage]);
    setQuery("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/process-intel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error("Failed to fetch LLM response");

      const data = await res.json();
      const botMessage = {
        type: "bot",
        content: data.response || "No response received.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto my-10 max-w-screen-md px-4">
      <Typography variant="h4" className="text-center mb-6">
        Ask a Question
      </Typography>

      {/* Chat Display Area */}
      <Card className="p-4 max-h-[70vh] overflow-y-auto space-y-4 mb-6 shadow-md">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`rounded-lg p-3 whitespace-pre-wrap ${
              msg.type === "user"
                ? "bg-blue-100 self-end text-right"
                : "bg-gray-100 self-start text-left"
            }`}
          >
            <Typography
              variant="small"
              className="text-gray-800"
            >
              {msg.content}
            </Typography>
          </div>
        ))}
        <div ref={chatEndRef} />
      </Card>

      {/* Input Area */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <Input
          type="text"
          label="Enter your query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full"
        />
        <Button
          color="blue"
          onClick={handleSubmit}
          disabled={loading || !query}
        >
          {loading ? <Spinner className="h-4 w-4" /> : "Submit"}
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert color="red" variant="gradient" className="mt-4">
          {error}
        </Alert>
      )}
    </div>
  );
}

export default Chat;
