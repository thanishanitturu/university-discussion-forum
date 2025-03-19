import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../Modals/clubsModal"; // Import the Modal component
import Sidebar from "../../components/sidebar"; // Import the Sidebar component
import styles from '../../assets/Clubs.module.css'; // Import your CSS styles
import { useUser } from "../../context/UserContext"; // Import the UserContext

const Alumni = () => {
  const { user } = useUser(); // Get user from context
  const [alumni, setAlumni] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alumniName, setAlumniName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [email, setEmail] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [phone, setPhone] = useState("");
  const [profile, setProfile] = useState(null); // State for profile image file

  // Fetch userType from the user context
  const userType = user?.userType; // Assuming the role field in the user object represents the userType

  console.log("user", userType);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await axios.get("http://localhost:5000/alumni", {
          headers: {
            Authorization: `Bearer ${user.token}`, // Include the token from context
          },
        });
        console.log(response)
        setAlumni(response.data);
       
      } catch (error) {
        console.error("Error fetching alumni:", error);
      }
    };
    fetchAlumni();
  }, [user.token]);

  const handleDeleteAlumni = async (alumniId) => {
    if (!window.confirm("Are you sure you want to delete this alumni?")) return;

    try {
        const token=user.token

      await axios.delete(`http://localhost:5000/alumni/${alumniId}`, {
        headers: { Authorization: `Bearer ${token}` }, // Send auth token
      });

      alert("Alumni deleted successfully!");
      window.location.reload(); // Refresh page after deletion
    } catch (error) {
      console.error("Error deleting alumni:", error);
      alert(error.response?.data?.message || "Failed to delete alumni");
    }
  };

  const handleCreateAlumni = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("alumniName", alumniName);
    formData.append("jobDescription", jobDescription);
    formData.append("contactInfo[email]", email);
    formData.append("contactInfo[linkedIn]", linkedIn);
    formData.append("contactInfo[phone]", phone);
    formData.append("profile", profile); // Ensure profile is a File object

    try {
      const response = await axios.post("http://localhost:5000/alumni", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAlumni((prev) => [...prev, response.data]);
      setIsModalOpen(false);
      setAlumniName("");
      setJobDescription("");
      setEmail("");
      setLinkedIn("");
      setPhone("");
      setProfile(null);

      console.log("Alumni created:", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error creating alumni:", error.response?.data || error.message);
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
        <div className={styles.clubs}>
          <h1>Alumni</h1>
          <div className={styles.clubList}>
            {alumni.map((alum) => (
                <div key={alum._id} className={styles.clubCard}>
                {console.log(alum)}
                {alum.profile && (
                <img
                    src={`data:image/png;base64,${alum.profile}`} // Display Base64 image
                    alt={alum.alumniName}
                    className={styles.clubLogo}
                />
                )}
                <h3>{alum.alumniName}</h3>
                <p>{alum.jobDescription}</p>
                <p>Email: {alum.contactInfo?.email}</p>
                <p>LinkedIn: {alum.contactInfo?.linkedIn || "N/A"}</p>
                <p>Phone: {alum.contactInfo?.phone || "N/A"}</p>

                {/* Conditionally render the "Delete Alumni" button for admins, faculty, or alumni */}
                {(userType === "admin" || userType === "faculty" || userType === "alumni") && (
                  <button
                    className={styles.joinButton}
                    onClick={() => handleDeleteAlumni(alum._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Conditionally render the "Create Alumni" button for admins, faculty, or alumni */}
          {(userType === "admin" || userType === "faculty" || userType === "alumni") && (
            <>
              <button
                className={styles.createButton}
                onClick={() => setIsModalOpen(true)}
              >
                Create Alumni
              </button>
              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateAlumni}
                title="Create Alumni"
                inputFields={[
                  {
                    label: "Alumni Name",
                    type: "text",
                    value: alumniName,
                    onChange: (e) => setAlumniName(e.target.value),
                  },
                  {
                    label: "Job Description",
                    type: "text",
                    value: jobDescription,
                    onChange: (e) => setJobDescription(e.target.value),
                  },
                  {
                    label: "Email",
                    type: "email",
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                  },
                  {
                    label: "LinkedIn (Optional)",
                    type: "text",
                    value: linkedIn,
                    onChange: (e) => setLinkedIn(e.target.value),
                  },
                  {
                    label: "Phone (Optional)",
                    type: "text",
                    value: phone,
                    onChange: (e) => setPhone(e.target.value),
                  },
                  {
                    label: "Profile Image",
                    type: "file",
                    onChange: (e) => setProfile(e.target.files[0]), // Handle file upload
                  },
                ]}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alumni;