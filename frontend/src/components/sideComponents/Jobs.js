import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../Modals/clubsModal"; // Modal component for job posting
import Sidebar from "../../components/sidebar"; // Sidebar component
import styles from '../../assets/jobs.module.css'; // Import CSS
import { useUser } from "../../context/UserContext"; // User context

const Jobs = () => {
  const { user } = useUser();
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [applyLink, setApplyLink] = useState("");

  const userType = user?.userType; // Check if user is employer or student

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/jobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/jobs",
        {
          title: jobTitle,
          description: jobDescription,
          applyLink: applyLink,
          postedBy: user?._id,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setJobs((prev) => [...prev, response.data]);
      setIsModalOpen(false);
      setJobTitle("");
      setJobDescription("");
      setApplyLink("");
      console.log("Job created:", response.data);
    } catch (error) {
      console.error("Error creating job:", error.response?.data || error.message);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await axios.delete(`http://localhost:5000/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      alert("Job deleted successfully!");
    } catch (error) {
      console.error("Error deleting job:", error);
      alert(error.response?.data?.message || "Failed to delete job");
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar userType={userType} userId={user?._id} />

      <div className={styles.mainContent}>
        <h1>Jobs</h1>
        <div className={styles.jobList}>
          {jobs.map((job) => (
            <div key={job._id} className={styles.jobCard}>
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              {console.log(job?.postedBy?.name)}
              <p>Posted by: {job?.postedBy?.name || "Unknown"}</p>
              <p>Date: {new Date(job.createdAt).toLocaleDateString()}</p>

              <a href={job.applyLink} target="_blank" rel="noopener noreferrer">
                <button className={styles.applyButton}>Apply Now</button>
              </a>
              {user?.id === job.postedBy?._id && (
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteJob(job._id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>

        {(userType === "faculty" || userType === "admin" || userType === "alumni") && (
          <>
            <button
              className={styles.createButton}
              onClick={() => setIsModalOpen(true)}
            >
              Post a Job
            </button>

            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleCreateJob}
              title="Post a Job"
              inputFields={[
                {
                  label: "Job Title",
                  type: "text",
                  value: jobTitle,
                  onChange: (e) => setJobTitle(e.target.value),
                },
                {
                  label: "Job Description",
                  type: "text",
                  value: jobDescription,
                  onChange: (e) => setJobDescription(e.target.value),
                },
                {
                  label: "Apply Link",
                  type: "text",
                  value: applyLink,
                  onChange: (e) => setApplyLink(e.target.value),
                },
              ]}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Jobs;
