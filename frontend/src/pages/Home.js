import React from 'react';
import '../assets/HomePage.css'

const HomePage = () => {
  return (
    <div className="homepage">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">

        <div className="container">

          <a className="navbar-brand" href="https://www.rguktrkv.ac.in/"><img src='https://www.rgukt.in/images/Logonew.png' alt='RGUKT' height={"30px"} width={"30px"}/></a>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">

            <span className="navbar-toggler-icon"></span>

          </button>

          <div className="collapse navbar-collapse" id="navbarNav">

            <ul className="navbar-nav ms-auto">

              <li className="nav-item">

                <a className="nav-link" href="/studentDashboard">About Us</a>

              </li>

              <li className="nav-item">

                <a className="nav-link" href="#contact">Contact Us</a>

              </li>

            </ul>

          </div>

        </div>

      </nav>



      <div className="hero-section">
        <h1>Welcome to Your University Discussion & Collaboration Platform</h1>
        <p>A unified space for students, faculty, and alumni to connect, collaborate, and thrive academically.</p>
      </div>

      <div className="description">

        <h3>About the Platform</h3>

        <div className="description-list">

          <div className="description-item">

            <span className="bullet">✔️</span>

            <span>Engage in Structured Discussions: Participate in academic discussions with peers and faculty in a well-organized forum.</span>

          </div>

          <div className="description-item">

            <span className="bullet">✔️</span>

            <span>Stay Updated: Receive real-time notifications for important announcements, events, and deadlines.</span>

          </div>

          <div className="description-item">

            <span className="bullet">✔️</span>

            <span>Manage Your Schedule: Access personalized class timetables and exam calendars to keep track of your academic commitments.</span>

          </div>

          <div className="description-item">

            <span className="bullet">✔️</span>

            <span>Join Student Clubs: Discover and engage with various student clubs, manage memberships, and participate in events.</span>

          </div>

          <div className="description-item">

            <span className="bullet">✔️</span>

            <span>Explore Career Opportunities: Find internships and job postings tailored to your interests and connect with alumni for mentorship.</span>

          </div>

          <div className="description-item">

            <span className="bullet">✔️</span>

            <span>Real-Time Interactions: Utilize live Q&A sessions, chatrooms, and a helpful chatbot for instant support.</span>

          </div>

        </div>

      </div>

      <div className="cta-section">
        <h3>Join Us Today!</h3>
        <a href="/signup"><button className="cta-button" onClick={() => alert('Sign Up Clicked!')}href="">Sign Up Now</button></a>
        <a href="/login"><button className="cta-button" onClick={() => alert('Login Clicked!')}>Login</button></a>
      </div>

      <footer className="footer">
        <div className="footer-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#help">Help Center</a>
        </div>
        <div className="contact-info">
          <p>Email: support@universityplatform.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;