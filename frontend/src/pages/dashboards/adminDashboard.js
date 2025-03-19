// StudentDashboard.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from '../../components/sidebar'; // Your sidebar component
import Announcements from "../../components/sideComponents/Announcements"; // Your announcements component
import Discussion from "../../components/sideComponents/Discussions"; // Example discussion component
import Schedule from "../../components/sideComponents/Schedule"; // Example schedule component
import Clubs from "../../components/sideComponents/Clubs"; // Example clubs component
import Jobs from "../../components/sideComponents/Jobs"; // Example jobs component
import Alumni from "../../components/sideComponents/Alumni"; // Example alumni stories component
import styles from '../../assets/studentDashboard.module.css'; // Import the CSS module

const AdminDashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      <div>
      <Sidebar userType="admin" className={styles.sidebar} />
      </div>
      <div className={styles.mainContent}>
        <Routes>
          <Route path="/admin/announcements" element={<Announcements />} />
          <Route path="/admin/discussion" element={<Discussion />} />
          <Route path="/admin/schedule" element={<Schedule />} />
          <Route path="/admin/clubs" element={<Clubs />} />
          <Route path="/admin/jobs" element={<Jobs />} />
          <Route path="/admin/alumni-stories" element={<Alumni />} />
          <Route path="/" element={<h2 className={styles.welcomeMessage}>Welcome to the Admin Dashboard!</h2>} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;