import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from '../assets/sidebar.module.css'; // Import CSS Module
import { useUser } from "../context/UserContext";

const Sidebar = ({ userType, userId }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { user } = useUser();
  console.log(user)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Define links for each user type
  const userLinks = {
    student: [
      { path: "/student/announcements", label: "Announcements", icon: "home" },
      { path: "/student/discussion", label: "Discussions", icon: "speedometer2" },
      { path: "/student/schedule", label: "Schedule", icon: "table" },
      { path: "/student/clubs", label: "Clubs", icon: "grid" },
      { path: "/student/jobs", label: "Jobs", icon: "briefcase" },
      { path: "/student/alumni", label: "Alumni", icon: "people-circle" },
    ],
    faculty: [
      { path: "/faculty/announcements", label: "Announcements", icon: "home" },
      { path: "/faculty/discussion", label: "Discussions", icon: "speedometer2" },
      { path: "/faculty/schedule", label: "Schedule", icon: "table" },
      { path: "/faculty/clubs", label: "Clubs", icon: "grid" },
      { path: "/faculty/jobs", label: "Jobs", icon: "briefcase" },
      { path: "/faculty/alumni", label: "Alumni", icon: "people-circle" },
    ],
   admin: [
      { path: "/admin/announcements", label: "Announcements", icon: "home" },
      { path: "/admin/discussion", label: "Discussions", icon: "speedometer2" },
      { path: "/admin/schedule", label: "Schedule", icon: "table" },
      { path: "/admin/clubs", label: "Clubs", icon: "grid" },
      { path: "/admin/jobs", label: "Jobs", icon: "briefcase" },
      { path: "/admin/alumni", label: "Alumni", icon: "people-circle" },
    ],
    clubCoordinator: [
      { path: "/clubCoordinator/announcements", label: "Announcements", icon: "home" },
      { path: "/clubCoordinator/discussion", label: "Discussions", icon: "speedometer2" },
      { path: "/clubCoordinator/schedule", label: "Schedule", icon: "table" },
      { path: "/clubCoordinator/clubs", label: "Clubs", icon: "grid" },
      { path: "/clubCoordinator/jobs", label: "Jobs", icon: "briefcase" },
      { path: "/clubCoordinator/alumni", label: "Alumni", icon: "people-circle" },
    ],
    alumni: [
      { path: "/alumni/announcements", label: "Announcements", icon: "home" },
      { path: "/alumni/discussion", label: "Discussions", icon: "speedometer2" },
      { path: "/alumni/schedule", label: "Schedule", icon: "table" },
      { path: "/alumni/clubs", label: "Clubs", icon: "grid" },
      { path: "/alumni/jobs", label: "Jobs", icon: "briefcase" },
      { path: "/alumni/alumni", label: "Alumni", icon: "people-circle" },
    ],
  };

  console.log("sidebar",user)
  // Get the links for the current user type
  const links = userLinks[userType] || [];
 

  return (
    <>
      {/* Hamburger Menu Button (Visible on Small Screens) */}
      <button className={styles.hamburgerButton} onClick={toggleSidebar}>
        ☰
      </button>

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}>
        <Link to="/" className={`${styles.sidebarHeader} d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none`}>
          <svg className="bi me-2" width="40" height="32"><use xlinkHref="#bootstrap"></use></svg>
          <span className="fs-4">UDF</span>
        </Link>
        <hr className={styles.sidebarDivider} />

        {/* Dynamic Links */}
        <ul className={`nav nav-pills flex-column mb-auto ${styles.navList}`}>
          {links.map((link, index) => (
            <li key={index} className="nav-item">
              <Link to={link.path} className={`nav-link ${styles.navLink}`}>
                <svg className="bi me-2" width="16" height="16">
                  <use xlinkHref={`#${link.icon}`}></use>
                </svg>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <hr className={styles.sidebarDivider} />

        {/* User Dropdown */}
        <div className={styles.dropdown}>
          <Link to="/profile" className={`d-flex align-items-center link-dark text-decoration-none dropdown-toggle ${styles.dropdownToggle}`} id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
            <img src="https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=" alt="profile" width="32" height="32" className="rounded-circle me-2" />
            <strong>{user?.userName}</strong>
          </Link>
          
        </div>
      </div>

      {/* Overlay for Small Screens */}
      {isSidebarOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;