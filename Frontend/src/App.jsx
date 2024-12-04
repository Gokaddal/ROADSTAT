import React, { useState, useEffect, Suspense } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Role } from "../../Backend/src/_helpers"; // Assuming `Role` is correctly imported
import { useAuth } from "./context/authContext";
import PrivateRoute from "./_components/PrivateRoute";

// Lazy-loaded components
const AdminPage = React.lazy(() => import("./AdminPage/AdminPage"));
const LoginPage = React.lazy(() => import("./LoginPage/LoginPage"));
const SignUpPage = React.lazy(() => import("./SignUpPage/SignUpPage"));
const VerifyPage = React.lazy(() => import("./SignUpPage/VerifyPage"));
const Sidebar = React.lazy(() => import("./Sidebar/sidebar"));
const Header = React.lazy(() => import("./Header/header"));
const Profile = React.lazy(() => import("./ProfilePage/profile"));
const HomePage = React.lazy(() => import("./HomePage/Home"));
const TrackPage = React.lazy(() => import("./TrackPage/Track"));
const EfficiencyPage = React.lazy(() =>
  import("./TruckControlPage/Efficiency")
);
const MaintenancePage = React.lazy(() =>
  import("./MaintenancePage/Maintenance")
);
const DriverPage = React.lazy(() => import("./DriverPage/Driver"));
const UsagePage = React.lazy(() => import("./TruckControlPage/Usage"));

// Custom Loader
const CustomLoader = () => (
  <div className="loader">
    <p>Loading...</p>
  </div>
);

function App() {
  const { user, logout } = useAuth(); // Extracting user and logout from context
  const [isAdmin, setIsAdmin] = useState(false);
  const [headerContent, setHeaderContent] = useState("Home");
  const [activeButtonC, setActiveButtonC] = useState("Home");

  useEffect(() => {
    // Set admin flag based on user role
    if (user) {
      setIsAdmin(user.role === Role.Admin);
    }
  }, [user]);

  const updateHeader = (content) => setHeaderContent(content);
  const updateButton = (buttonName) => setActiveButtonC(buttonName);

  return (
    <div>
      {/* Header Section */}
      {user && (
        <Suspense fallback={<CustomLoader />}>
          <Header
            currentUser={user}
            logout={logout}
            headerContent={headerContent}
            activeButtonC={activeButtonC}
          />
        </Suspense>
      )}

      {/* Sidebar Section */}
      {user && (
        <Suspense fallback={<CustomLoader />}>
          <Sidebar
            isAdmin={isAdmin}
            logout={logout}
            activeButtonC={activeButtonC}
          />
        </Suspense>
      )}

      {/* Main Content */}
      <div className="jumbotrons">
        <div className="container">
          <Suspense fallback={<CustomLoader />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/verify" element={<VerifyPage />} />

              {/* Private Routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute
                    element={HomePage}
                    updateHeader={updateHeader}
                    updateButton={updateButton}
                  />
                }
              />
              <Route
                path="/home"
                element={
                  <PrivateRoute
                    element={HomePage}
                    updateHeader={updateHeader}
                    updateButton={updateButton}
                  />
                }
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute
                    element={AdminPage}
                    roles={[Role.Admin]}
                    updateHeader={updateHeader}
                    updateButton={updateButton}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute
                    element={Profile}
                    updateHeader={updateHeader}
                    updateButton={updateButton}
                  />
                }
              />
              <Route
                path="/track"
                element={
                  <PrivateRoute
                    element={TrackPage}
                    updateHeader={updateHeader}
                    updateButton={updateButton}
                  />
                }
              />
              <Route
                path="/truckcontrol/usage"
                element={
                  <PrivateRoute
                    element={UsagePage}
                    updateHeader={updateHeader}
                    updateButton={updateButton}
                  />
                }
              />
              <Route
                path="/truckcontrol/efficiency"
                element={
                  <PrivateRoute
                    element={EfficiencyPage}
                    updateHeader={updateHeader}
                    updateButton={updateButton}
                  />
                }
              />
              <Route
                path="/maintenance"
                element={
                  <PrivateRoute
                    element={MaintenancePage}
                    updateHeader={updateHeader}
                    updateButton={updateButton}
                  />
                }
              />
              <Route
                path="/driver"
                element={
                  <PrivateRoute
                    element={DriverPage}
                    updateHeader={updateHeader}
                    updateButton={updateButton}
                  />
                }
              />
              <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default App;
