import Home from "./pages/Home";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Signup from "./components/signup";
import Login from "./components/login";
import SelectUserType from "./components/SelectUserType";
import Sidebar from './components/sidebar'
import {UserProvider} from './context/UserContext'
import StudentDashboard from "./pages/dashboards/studentDashboard";
import FacultyDashboard from "./pages/dashboards/FacultyDashboard";
import AlumniDashboard from "./pages/dashboards/alumniDashboard";
import AdminDashboard from "./pages/dashboards/adminDashboard";
import ClubCoordinatorDashboard from "./pages/dashboards/clubCoordinatorDashboard";
import Announcements from "./components/sideComponents/Announcements";
import Clubs from "./components/sideComponents/Clubs"
import Discussions from "./components/sideComponents/Discussions"
import Alumni from "./components/sideComponents/Alumni"
import Jobs from "./components/sideComponents/Jobs"
import Schedule from "./components/sideComponents/Schedule"
import Profile from "./pages/profilePage"

const App = () => {

    return (
      <UserProvider>
          
        <div>
        
        <Router>

        <Routes>
          
          <Route path="/" element={<Home />} exact />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/select-user-type" element={<SelectUserType/>} />
          <Route path="/sidebar" element={<Sidebar/>}/>
          <Route path="/studentDashboard" element={<StudentDashboard/>}/>
          <Route path="/FacultyDashboard" element={<FacultyDashboard/>}/>
          <Route path="/AdminDashboard" element={<AdminDashboard/>}/>
          <Route path="/AlumniDashboard" element={<AlumniDashboard/>}/>
          <Route path="/ClubCoordinatorDashboard" element={<ClubCoordinatorDashboard/>}/>
          <Route path="/student/announcements" element={<Announcements/>}/>
          <Route path="/faculty/announcements" element={<Announcements/>}/>
          <Route path="/admin/announcements" element={<Announcements/>}/>
          <Route path="/alumni/announcements" element={<Announcements/>}/>
          <Route path="/clubCoordinator/announcements" element={<Announcements/>}/>
          <Route path="/student/clubs" element={<Clubs/>}/>
          <Route path="/faculty/clubs" element={<Clubs/>}/>
          <Route path="/admin/clubs" element={<Clubs/>}/>
          <Route path="/alumni/clubs" element={<Clubs/>}/>
          <Route path="/clubCoordinator/clubs" element={<Clubs/>}/>
          <Route path="/student/discussion" element={<Discussions/>}/>
          <Route path="/faculty/discussion" element={<Discussions/>}/>
          <Route path="/admin/discussion" element={<Discussions/>}/>
          <Route path="/alumni/discussion" element={<Discussions/>}/>
          <Route path="/clubCoordinator/discussion" element={<Discussions/>}/>
          <Route path="/student/alumni" element={<Alumni/>}/>
          <Route path="/faculty/alumni" element={<Alumni/>}/>
          <Route path="/admin/alumni" element={<Alumni/>}/>
          <Route path="/alumni/alumni" element={<Alumni/>}/>
          <Route path="/clubCoordinator/alumni" element={<Alumni/>}/>
          <Route path="/student/jobs" element={<Jobs/>}/>
          <Route path="/faculty/jobs" element={<Jobs/>}/>
          <Route path="/admin/jobs" element={<Jobs/>}/>
          <Route path="/alumni/jobs" element={<Jobs/>}/>
          <Route path="/clubCoordinator/jobs" element={<Jobs/>}/>
          <Route path="/student/schedule" element={<Schedule/>}/>
          <Route path="/faculty/schedule" element={<Schedule/>}/>
          <Route path="/admin/schedule" element={<Schedule/>}/>
          <Route path="/alumni/schedule" element={<Schedule/>}/>
          <Route path="/clubCoordinator/schedule" element={<Schedule/>}/>
          <Route path="/profile" element={<Profile/>}/>

          


        </Routes>
        </Router>
      </div>
      </UserProvider>
    );
};

export default App;
