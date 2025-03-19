import React, { useState } from "react";
import styles from "./DiscussionModal.module.css"; // Import CSS module
import axios from "axios";

const DiscussionModal = ({ isOpen, onClose, addThread }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/threads",
        { title, content },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      if (response.status === 201) {
        addThread(response.data.thread);
        setTitle("");
        setContent("");
        onClose();
      } else {
        alert("Error creating thread");
      }
    } catch (error) {
      console.error("Error creating thread:", error);
      alert("Failed to create thread.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Create a New Discussion</h2>
        <form onSubmit={handleCreateThread} className={styles.form}>
          <input
            type="text"
            placeholder="Thread Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
            required
          />
          <textarea
            placeholder="Thread Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles.textarea}
            required
          ></textarea>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.createButton}>
              Create Thread
            </button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiscussionModal;
