'use client'
import { useState, useRef, useEffect } from "react";
import styles from '../../ChatPage.module.css'; // Import the CSS Module
import containerStyles from '../workoutplan/styles/Workouts.module.css';
import useUserData from '../../../store/userData';
import { shallow } from 'zustand/shallow';
import deepEqual from 'fast-deep-equal'; 

// Simple Send Icon (SVG) - No install needed
// (Keep the SendIcon component as defined in the previous answer)
const SendIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      // SVG icon size can be controlled by parent's font size or explicit CSS
    >
      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
  );


export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("You");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);


  const userSnapshot = useUserData.getState()


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const textInput = form.elements.namedItem("msg");
    const text = textInput.value.trim();

    if (!text || isLoading) return;

    const newUserMessage = { role: "user", text };
    const nextMessages = [...messages, newUserMessage];
    setMessages(nextMessages);
    form.reset();
    setIsLoading(true);

    try {
      const userSnapshot = useUserData.getState();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, user : userSnapshot }),
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
      }

      const data = await res.json();
      
      (data.functionCalls ?? []).forEach((c) => {
        try {
          const args = JSON.parse(c.arguments || "{}");
      
          switch (c.name) {
            case "setClientVars":
              if (args.name) userSnapshot.setUserName(args.name);
              if (args.age)  userSnapshot.setAge(String(args.age));
              if (args.height) userSnapshot.setHeight(String(args.height));
              if (args.weight) userSnapshot.setWeight(String(args.weight));
              break;
      
            case "updateFitnessStats":
              if (args.bench)    userSnapshot.setBench(args.bench);
              if (args.squat)    userSnapshot.setSquat(args.squat);
              if (args.deadlift) userSnapshot.setDeadlift(args.deadlift);
              break;
      
            case "setMileTime":
              if (args.mileTime) userSnapshot.setMileTime(args.mileTime);
              break;
      
            default:
              console.warn("Unknown function call:", c.name);
          }
        } catch (error) {
          console.error("Failed to parse function call arguments:", error);
        }
      });

      const assistantMessage = { role: "model", text: data.reply };
      setMessages((currentMessages) => [...currentMessages, assistantMessage]);

    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((currentMessages) => [
        ...currentMessages.slice(0, -1),
        { role: "system", text: "Sorry, I couldn't get a response. Please try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  // Helper to get conditional classes for messages
  const getMessageWrapperClass = (role) => {
      switch (role) {
          case 'user': return `${styles.messageWrapper} ${styles.userWrapper}`;
          case 'model': return `${styles.messageWrapper} ${styles.modelWrapper}`;
          case 'system': return `${styles.messageWrapper} ${styles.systemWrapper}`;
          default: return styles.messageWrapper;
      }
  }

  const getMessageBubbleClass = (role) => {
    switch (role) {
        case 'user': return `${styles.messageBubble} ${styles.userMessage}`;
        case 'model': return `${styles.messageBubble} ${styles.modelMessage}`;
        case 'system': return `${styles.messageBubble} ${styles.systemMessage}`;
        default: return styles.messageBubble;
    }
}


  return (
    
    <div className={styles.chatContainer}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          Chat with AI{" "}
          {name !== "You" && (
             <span className={styles.nameHighlight}>(as {name})</span>
           )}
        </h1>
      </div>

      {/* Message List Area */}
      <div className={styles.messageList}>
         {messages.length === 0 && (
             <p className={styles.emptyState}>Start the conversation!</p>
         )}
        {messages.map((m, i) => (
          <div key={i} className={getMessageWrapperClass(m.role)}>
            <div className={getMessageBubbleClass(m.role)}>
              {m.text}
            </div>
          </div>
        ))}
        {/* Dummy div for scrolling */}
        <div ref={messagesEndRef} />
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className={styles.loadingIndicator}>
          Thinking...
        </div>
      )}

      {/* Input Area */}
      <div className={styles.inputArea}>
        <form onSubmit={handleSend} className={styles.inputForm}>
          <input
            name="msg"
            className={styles.messageInput}
            placeholder="Say something…"
            autoComplete="off"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={styles.sendButton}
            disabled={isLoading}
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
}