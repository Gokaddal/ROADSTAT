import React, { useState, useEffect, useRef } from "react";
import "../Header/header.css";
import { useNavigate } from "react-router-dom";

function Header({ currentUser, logout, activeButtonC }) {
  const navigate = useNavigate();
  const [popupVisible, setPopupVisible] = useState(false);
  const popupRef = useRef(null);

  // Debugging the currentUser object
  useEffect(() => {
    console.log("Current User:", currentUser);
  }, [currentUser]);

  const handleButtonClick = (buttonName) => {
    const routes = {
      Home: "/home",
      Track: "/track",
      "Vehicle Control": "/truckcontrol/usage",
      Maintenance: "/maintenance",
      Driver: "/driver",
    };
    navigate(routes[buttonName] || "/");
    console.log(buttonName);
  };

  const togglePopup = () => {
    setPopupVisible(!popupVisible);
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setPopupVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header_bg">
      <div className="icons">
        <img src="/images/roadstatLogo.png" alt="Logo" className="road_logo" />

        <img
          src="/images/userIcon.png"
          alt="User Icon"
          className="user_icon"
          onClick={togglePopup}
        />

        {popupVisible && (
          <div className="user_popup" ref={popupRef}>
            <p>
              <img src="/images/user.png" alt="User Icon" />
              {currentUser?.username || "Guest"} {/* Fallback to "Guest" */}
            </p>
            <a href="#" onClick={logout}>
              <img src="/images/logout.png" alt="Logout Icon" />
              Logout
            </a>
          </div>
        )}

        <div className="nav_container">
          {["Home", "Track", "Vehicle Control", "Maintenance", "Driver"].map(
            (buttonName) => (
              <div
                key={buttonName}
                className={activeButtonC === buttonName ? "active" : ""}
                onClick={() => handleButtonClick(buttonName)}
              >
                {buttonName === "Vehicle Control"
                  ? "Asset Control"
                  : buttonName}
              </div>
            )
          )}
        </div>
      </div>
      <div className="half_bg"></div>
    </header>
  );
}

export default Header;
