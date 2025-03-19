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

const AlumniDashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      <div>
      <Sidebar userType="alumni" className={styles.sidebar} />
      </div>
      <div className={styles.mainContent}>
        <Routes>
          <Route path="/alumni/announcements" element={<Announcements />} />
          <Route path="/alumni/discussion" element={<Discussion />} />
          <Route path="/alumni/schedule" element={<Schedule />} />
          <Route path="/alumni/clubs" element={<Clubs />} />
          <Route path="/alumni/jobs" element={<Jobs />} />
          <Route path="/alumni/alumni-stories" element={<Alumni />} />
          <Route path="/" element={<h2 className={styles.welcomeMessage}>Welcome to the Alumni Dashboard!</h2>} />
        </Routes>
      </div>
    </div>
  );
};

export default AlumniDashboard;