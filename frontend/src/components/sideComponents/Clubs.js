import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../Modals/clubsModal"; // Import the Modal component
import Sidebar from "../../components/sidebar"; // Import the Sidebar component
import styles from '../../assets/Clubs.module.css'; // Import your CSS styles
import { useUser } from "../../context/UserContext"; // Import the UserContext

const Clubs = () => {
  const { user } = useUser(); // Get user from context
  const [clubs, setClubs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clubName, setClubName] = useState("");
  const [clubDescription, setClubDescription] = useState("");
  const [clubLogo, setClubLogo] = useState(null); // State for logo file

  // Fetch userType from the user context
  const userType = user?.userType; // Assuming the role field in the user object represents the userType

  console.log("user", userType);
  
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/clubs", {
          headers: {
            Authorization: `Bearer ${user.token}`, // Include the token from context
          },
        });
        setClubs(response.data);
      } catch (error) {
        console.error("Error fetching clubs:", error);
      }
    };
    fetchClubs();
  }, [user.token]);



const handleDeleteClub = async (clubId) => {
  if (!window.confirm("Are you sure you want to delete this club?")) return;

  try {
    const token = localStorage.getItem("token"); // Get token from storage
    if (!token) {
      alert("Unauthorized! Please log in.");
      return;
    }

    await axios.delete(`http://localhost:5000/clubs/${clubId}`, {
      headers: { Authorization: `Bearer ${token}` }, // Send auth token
    });

    alert("Club deleted successfully!");
    window.location.reload(); // Refresh page after deletion
  } catch (error) {
    console.error("Error deleting club:", error);
    alert(error.response?.data?.message || "Failed to delete club");
  }
};
const handleCreateClub = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", clubName);
  formData.append("description", clubDescription);
  formData.append("coordinator", user?.userName);
  formData.append("logo", clubLogo); // Ensure logo is a File object

  try {
    const response = await axios.post("http://localhost:5000/clubs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setClubs((prev) => [...prev, response.data]);
    setIsModalOpen(false);
    setClubName("");
    setClubDescription("");
    setClubLogo(null);

    console.log("Club created:", response.data);
    window.location.reload();
  } catch (error) {
    console.error("Error creating club:", error.response?.data || error.message);
  }
};



  const handleJoinClub = async (clubId) => {
    
    try {
      const response = await axios.post(
        `http://localhost:5000/clubs/${clubId}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // Update the clubs state with the updated club data
      setClubs((prevClubs) =>
        prevClubs.map((club) =>
          club._id === clubId ? response.data : club
        )
      );
    } catch (error) {
      console.error("Error joining club:", error);
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
          <h1>Clubs</h1>
          <div className={styles.clubList}>
            {clubs.map((club) => (
              <div key={club._id} className={styles.clubCard}>
                  {club.logo && (
                    <img
                      src={`data:image/png;base64,${club.logo}`} // Display Base64 image
                      // alt={club.name}
                      alt="hello"
                      className={styles.clubLogo}
                    />
                  )}
                <h3>{club.name}</h3>
                <p>{club.description}</p>
                <p>Coordinator: {club?.coordinator}</p> {/* Assuming coordinator has a name field */}
                <p>Members: {club.members?.length || 0}</p> {/* Display number of members */}
                <p>Date: {new Date(club.createdAt).toLocaleDateString()}</p>

                {/* Conditionally render the "Join Club" button for students */}
                {userType === "student" && !club.members?.includes(user.userName) && (
                  <button
                    className={styles.joinButton}
                    onClick={() => handleJoinClub(club._id)}
                  >
                    Join Club
                  </button>
                )}
                {userType === "clubCoordinator" && (
                  <button
                    className={styles.joinButton}
                    onClick={() => handleDeleteClub(club._id)}
                  >
                    delete
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Conditionally render the "Create Club" button for club coordinators */}
          {userType === "clubCoordinator" && (
            <>
              <button
                className={styles.createButton}
                onClick={() => setIsModalOpen(true)}
              >
                Create Club
              </button>
              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateClub}
                title="Create Club"
                inputFields={[
                  {
                    label: "Club Name",
                    type: "text",
                    value: clubName,
                    onChange: (e) => setClubName(e.target.value),
                  },
                  {
                    label: "Club Description",
                    type: "text",
                    value: clubDescription,
                    onChange: (e) => setClubDescription(e.target.value),
                  },
                  {
                    label: "Club Logo",
                    type: "file",
                    onChange: (e) => setClubLogo(e.target.files[0]), // Handle file upload
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

export default Clubs;