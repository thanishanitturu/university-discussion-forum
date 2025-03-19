import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../Modals/AnnouncementModal"; // Import the Modal component
import Sidebar from "../../components/sidebar"; // Import the Sidebar component
import styles from '../../assets/Announcements.module.css'; // Import your CSS styles
import { useUser } from "../../context/UserContext"; // Import the UserContext

const Announcements = () => {
  const { user } = useUser(); // Get user from context
  const [announcements, setAnnouncements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Fetch userType from the user context
  const userType = user?.userType; // Assuming the role field in the user object represents the userType

  console.log("user",userType)


  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get("http://localhost:5000/announcements");
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, []);

  console.log(user.token)

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
       const response = await axios.post(
      'http://localhost:5000/announcements',
      {
        title,
        description,
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`, // Include the token from context
        },
      }
    );
      setAnnouncements((prev) => [...prev, response.data]);
      setIsModalOpen(false); // Close the modal after submission
      setTitle(""); // Clear the title input
      setDescription(""); // Clear the description input
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <div>
        <Sidebar userType={userType} userId={user?._id} />
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.announcements}>
          <h1>Announcements</h1>
          <div className={styles.announcementList}>
            {announcements.map((announcement) => (
              <div key={announcement._id} className={styles.announcementCard}>
                <h3>{announcement.title}</h3>
                <p>{announcement.description}</p>
                <p>Created by: {announcement.createdBy}</p> {/* Assuming createdBy has a name field */}
                <p>Date: {new Date(announcement.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>

          {/* Conditionally render the "Create Announcement" button for admin and faculty */}
          {(userType === "admin" || userType === "faculty") && (
            <>
              <button
                className={styles.createButton}
                onClick={() => setIsModalOpen(true)}
              >
                Create Announcement
              </button>
              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateAnnouncement}
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;