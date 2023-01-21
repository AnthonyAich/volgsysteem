import { Routes, Route } from 'react-router-dom';
import "./App.scss";
import Error404 from './pages/Error404/Error404';
import HostViewGroup from './pages/HostViewGroup/HostViewGroup';
import Login from './pages/Login/Login';
import PrivateRoute from './pages/PrivateRoutes/PrivateRoute';
import StudentView from './pages/StudentView/StudentView';
import StudentViewGroup from './pages/StudentView/StudentViewGroup';
import AdminViewGroup from './pages/AdminViewGroup/AdminViewGroup';
import AdminView from './pages/AdminViewGroup/AdminView';
import AssignmentPage from './pages/StudentView/AssignmentPage';
import HostView from './pages/HostViewGroup/HostView';
import HostViewElement from './pages/HostViewGroup/HostViewElement';
import CreateProfile from './pages/CreateProfile/CreateProfile';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<CreateProfile />} />
      <Route path="/" element={<PrivateRoute role="Student,Host,Admin" element={<StudentViewGroup />} />} />
      <Route path="/stv/:id" element={<PrivateRoute role="Student,Host,Admin" element={<StudentView />} />} />
      <Route path="/assignment/:id" element={<PrivateRoute role="Student,Host,Admin" element={<AssignmentPage />} />} />
      <Route path="/hvg" element={<PrivateRoute role="Host,Admin" element={<HostViewGroup />} />} />
      <Route path="/hv/:id" element={<PrivateRoute role="Host,Admin" element={<HostView />} />} />
      <Route path="/hve/:id" element={<PrivateRoute role="Host,Admin" element={<HostViewElement />} />} />
      <Route path="/avg" element={<PrivateRoute role="Admin" element={<AdminViewGroup />} />} />
      <Route path="/av/:id" element={<PrivateRoute role="Admin" element={<AdminView />} />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}

export default App;
