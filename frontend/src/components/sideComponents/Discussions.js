import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../sidebar";
import Modal from "react-modal";
import styles from "../../assets/Discussions.module.css";
import { useUser } from "../../context/UserContext";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const DiscussionForum = () => {
  const { user } = useUser();
  const [threads, setThreads] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);
  const [replyContent, setReplyContent] = useState(""); // State for reply input
  const [expandedThreadId, setExpandedThreadId] = useState(null); // Track which thread is expanded

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      const response = await axios.get("http://localhost:5000/threads");
      setThreads(response.data);
    } catch (error) {
      console.error("Error fetching threads:", error);
    }
  };

  const handleLikeThread = async (threadId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/threads/${threadId}/like`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread._id === threadId ? { ...thread, likes: response.data.thread.likes } : thread
        )
      );
    } catch (error) {
      console.error("Error liking thread:", error);
    }
  };

  const handleDislikeThread = async (threadId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/threads/${threadId}/dislike`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread._id === threadId ? { ...thread, dislikes: response.data.thread.dislikes } : thread
        )
      );
    } catch (error) {
      console.error("Error disliking thread:", error);
    }
  };

  const handleCreateThread = async (e) => {
    e.preventDefault();
    try {
      const author = user.userName;
      const authorId = user.id;
      const response = await axios.post(
        "http://localhost:5000/threads",
        { title, content, author, authorId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setThreads([response.data.newThread, ...threads]);
      setTitle("");
      setContent("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating thread:", error);
    }
  };

  // const handleReplySubmit = async (threadId) => {
  //   try {
  //     const response = await axios.post(
  //       `http://localhost:5000/threads/${threadId}/replies`,
  //       { content: replyContent, author: user.userName, authorId: user.id },
  //       { headers: { Authorization: `Bearer ${user.token}` } }
  //     );
  //     setThreads((prevThreads) =>
  //       prevThreads.map((thread) =>
  //         thread._id === threadId
  //           ? { ...thread, replies: response.data.thread.replies }
  //           : thread
  //       )
  //     );
  //     setReplyContent(""); // Clear the reply input
  //   } catch (error) {
  //     console.error("Error submitting reply:", error);
  //   }
  // };

  const handleReplySubmit = async (threadId) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/threads/${threadId}/replies`,
      { content: replyContent, author: user.userName, authorId: user.id },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );

    const newReply = response.data.reply; // The created reply object

    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread._id === threadId
          ? { ...thread, replies: [...thread.replies, newReply._id] } // Add the reply ID
          : thread
      )
    );

    setReplyContent(""); // Clear the reply input
  } catch (error) {
    console.error("Error submitting reply:", error);
  }
};

  const handleDeleteThread = async (threadId) => {
  try {
    await axios.delete(`http://localhost:5000/threads/${threadId}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    // Remove the deleted thread from the state
    setThreads((prevThreads) => prevThreads.filter((thread) => thread._id !== threadId));
  } catch (error) {
    console.error("Error deleting thread:", error);
  }
};


  const toggleReplies = (threadId) => {
    setExpandedThreadId(expandedThreadId === threadId ? null : threadId);
  };

  return (
    <div className={styles.discussionContainer}>
      <Sidebar userType={user.userType} userId={user?._id} />
      <div className={styles.mainDiscussion}>
        <div className={styles.discussionHeader}>
          <h1 className={styles.header}>Discussion Forum</h1>
          {user && (
            <button
              onClick={() => setIsModalOpen(true)}
              className={styles.createButton}
            >
              Create Discussion
            </button>
          )}
        </div>
        <div className={styles.threadList}>
          {Array.isArray(threads) && threads.length > 0 ? (
            threads.map((thread) => (
              <div
                key={thread._id || Math.random()}
                className={styles.threadCard}
              >
                <h2>{thread.title}</h2>
                <p>{thread.content}</p>
                <small className={styles.threadAuthor}>by {thread.author}</small>
                <div className={styles.threadActions}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeThread(thread._id);
                    }}
                    className={styles.likeButton}
                  >
                    <FaThumbsUp /> ({Array.isArray(thread.likes) ? thread.likes.length : 0})
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDislikeThread(thread._id);
                    }}
                    className={styles.dislikeButton}
                  >
                    <FaThumbsDown /> ({Array.isArray(thread.dislikes) ? thread.dislikes.length : 0})
                  </button>
                  <button
                    onClick={() => toggleReplies(thread._id)}
                    className={styles.replyButton}
                  >
                    {expandedThreadId === thread._id ? "Hide Replies" : "Show Replies"}
                  </button>
                  {user && user.id === thread.authorId && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteThread(thread._id);
              }}
              className={styles.deleteButton}
            >
              Delete Thread
            </button>
          )}
                </div>

                {/* Reply Section */}
                {expandedThreadId === thread._id && (
                  <div className={styles.replySection}>
                    <div className={styles.replyList}>
                      {Array.isArray(thread.replies) && thread.replies.length > 0 ? (
                        thread.replies.map((reply) => (
                          <ul>
                          <li><div key={reply._id} className={styles.replyCard}>
                            <p>{reply.content}</p>
                            <small className={styles.replyAuthor}>by {reply.author}</small>
                          </div></li>
                          </ul>
                        ))
                      ) : (
                        <p>No replies yet.</p>
                      )}
                    </div>
                    <div className={styles.replyForm}>
                      <textarea
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                      />
                      <button
                        onClick={() => handleReplySubmit(thread._id)}
                        className={styles.submitReplyButton}
                      >
                        Submit Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No discussions available.</p>
          )}
        </div>
      </div>

      {/* Create Discussion Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
      >
        <div className={styles.modalContent}>
          <h2>Create a New Discussion</h2>
          <form onSubmit={handleCreateThread}>
            <div className={styles.formGroup}>
              <label>Thread Title</label>
              <input
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Thread Content</label>
              <textarea
                placeholder="Enter content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
            </div>
            <div className={styles.modalActions}>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button type="submit">Create</button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default DiscussionForum;