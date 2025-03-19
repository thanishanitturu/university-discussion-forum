import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext"; // Assuming UserContext is set up
import axios from "axios";
import styles from "../assets/Profile.module.css"; // Import the CSS Module

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    if (user.id) {
      fetchUserData(user.id);
    }
  }, [user]);

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${userId}`);
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  if (!userData) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.textCenter}>
        <img
          src={userData.avatar || "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="}
          alt="User Avatar"
          className={styles.avatar}
        />
        <h2 className={styles.name}>{userData.name}</h2>
        <p className={styles.email}>{userData.email}</p>
        <p className={styles.userType}>{userData.userType.toUpperCase()}</p>
      </div>
    </div>
  );
};

export default ProfilePage;