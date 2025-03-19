import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../Modals/ScheduleModal"; // Import the Modal component
import Sidebar from "../../components/sidebar";
import styles from "../../assets/Schedule.module.css";
import { useUser } from "../../context/UserContext";

const Schedule = () => {
  const { user } = useUser();
  const [schedules, setSchedules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduleTitle, setScheduleTitle] = useState("");
  const [scheduleDescription, setScheduleDescription] = useState("");
  const [scheduleFile, setScheduleFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // Track loading state for downloads
  const [loadingUpload, setLoadingUpload] = useState(false);
const [loadingDownload, setLoadingDownload] = useState({});  // Track upload loader

  const userType = user?.userType;

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get("http://localhost:5000/schedules");
        setSchedules(response.data);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };
    fetchSchedules();
  }, []);

  // ✅ Handle PDF Download Without Redirect
// const handleDownload = async (fileUrl, fileName) => {
//     setLoadingDownload(true);
//   try {
//     const response = await axios.get(fileUrl, {
//       responseType: "blob", // Get binary data
//     });

//     // Create a temporary URL for downloading
//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", fileName || "download.pdf"); // Set download filename
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   } catch (error) {
//     console.error("Error downloading file:", error);
//   }finally
//   {
//     setLoadingDownload(false)
//   }
  
// };

const handleDownload = async (fileUrl, fileName) => {
  setLoadingDownload((prev) => ({ ...prev, [fileUrl]: true })); // Track each file

  try {
    const response = await axios.get(fileUrl, {
      responseType: "blob", // Get binary data
    });

    // Create a temporary URL for downloading
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName || "download.pdf"); // Set download filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading file:", error);
  } finally {
    setLoadingDownload((prev) => ({ ...prev, [fileUrl]: false })); // Reset for that file
  }
};


  // ✅ Handle File Upload With Loader
  const handleUploadSchedule = async (e) => {
    e.preventDefault();
    setIsUploading(true); 
    const formData = new FormData();
    formData.append("title", scheduleTitle);
    formData.append("description", scheduleDescription);
    formData.append("file", scheduleFile);
    formData.append("uploadedBy", user?.id);

    try {
      const response = await axios.post("http://localhost:5000/schedules", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSchedules((prev) => [...prev, response.data]);
      setIsModalOpen(false);
      setScheduleTitle("");
      setScheduleDescription("");
      setScheduleFile(null);
    } catch (error) {
      console.error("Error uploading schedule:", error.response?.data || error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar userType={userType} userId={user?._id} />
      <div className={styles.mainContent}>
        <h1>Schedules</h1>
        <div className={styles.scheduleList}>
          {schedules.map((schedule) => (
            <div key={schedule._id} className={styles.scheduleCard}>
              <h3>{schedule.title}</h3>
              <p>{schedule.description}</p>
              <button
  className={styles.downloadButton}
  onClick={() => handleDownload(schedule.fileUrl, `${schedule.title}.pdf`)}
  disabled={loadingDownload[schedule.fileUrl]} // Disable only the clicked button
>
  {loadingDownload[schedule.fileUrl] ? "Downloading..." : "Download PDF"}
</button>

            </div>
          ))}
        </div>

        {userType === "admin" && (
          <>
            <button
              className={styles.uploadButton}
              onClick={() => setIsModalOpen(true)}
              disabled={loadingUpload}
            >
              {loadingUpload ? "Uploading..." : "Upload Schedule"}
            </button>
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleUploadSchedule}
              title="Upload Schedule"
              inputFields={[
                { label: "Schedule Title", type: "text", value: scheduleTitle, onChange: (e) => setScheduleTitle(e.target.value) },
                { label: "Description", type: "text", value: scheduleDescription, onChange: (e) => setScheduleDescription(e.target.value) },
                { label: "Upload PDF", type: "file", onChange: (e) => setScheduleFile(e.target.files[0]) },
              ]}
               // Change text dynamically
            isUploading={isUploading}
            />
            
          </>
        )}
      </div>
    </div>
  );
};

export default Schedule;
