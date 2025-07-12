import React, { useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Alert,
  Spinner,
} from "@material-tailwind/react";

export function Chat() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await fetch("http://localhost:5000/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error("Failed to fetch LLM response");

      const data = await res.json();
      setResponse(data.response || "No response received.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8 px-4">
      <Typography variant="h4" className="text-center">
        Ask a Question
      </Typography>

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

      {error && (
        <Alert color="red" variant="gradient">
          {error}
        </Alert>
      )}

      {response && (
        <Card className="mt-4">
          <CardHeader floated={false} shadow={false} className="bg-blue-500 text-white p-4">
            <Typography variant="h6">LLM Response</Typography>
          </CardHeader>
          <CardBody>
            <Typography>{response}</Typography>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

export default Chat;
