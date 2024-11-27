import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Usage.css";

const apiUrl = import.meta.env.VITE_API_URL;

function UsagePage({ updateHeader, updateButton }) {
  const [activeButton, setActiveButton] = useState("Usage");
  const [toggledButtonName, setToggledButtonName] =
    useState("Asset Information");
  const [truckData, setTruckData] = useState([]);
  const [selectedTruckNo, setSelectedTruckNo] = useState(null);
  const [tirePressure, setTirePressure] = useState(null);
  const [brakeHealth, setBrakeHealth] = useState(null);
  const [engineTemp, setEngineHealth] = useState(null);
  const [batteryHealth, setBatteryHealth] = useState(null);
  const [fuelLevel, setFuelLevel] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [collisionHistory, setCollisionHistory] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupPosition, setPopupPosition] = useState({});
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const truckNo = queryParams.get("truckNo");
  const [searchedTruckNo, setSearchedTruckNo] = useState(truckNo || "");

  useEffect(() => {
    updateHeader("Truck Control / Usage");
    updateButton("Vehicle Control");
    fetchTruckData();
    fetchCollisionHistory();
  }, [updateHeader, updateButton]);

  useEffect(() => {
    if (truckData.length > 0) {
      const defaultSelectedTruckId = truckData[0].truckId;
      fetchTruckControlData(defaultSelectedTruckId);
    }
  }, [truckData]);

  useEffect(() => {
    if (searchedTruckNo) {
      const foundIndex = truckData.findIndex(
        (truck) => truck.truckId === searchedTruckNo
      );
      if (foundIndex !== -1) {
        setSelectedRowIndex(0);
        setSelectedTruckNo(searchedTruckNo);
        fetchTruckControlData(searchedTruckNo);
      }
    }
  }, [searchedTruckNo, truckData]);

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  const handleTruckClick = async (index, truckId) => {
    setSelectedRowIndex(index);
    setSelectedTruckNo(truckId);
    fetchTruckControlData(truckId);
  };

  const fetchTruckControlData = async (truckId) => {
    try {
      const response = await fetch(`${apiUrl}/truck-control/${truckId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch truck control data");
      }
      const data = await response.json();

      setTirePressure(data?.tirePressure);
      setBrakeHealth(data?.brakeHealth);
      setEngineHealth(data?.engineTemp);
      setBatteryHealth(data?.batteryHealth);
      setFuelLevel(data?.fuelLevel);
    } catch (error) {
      console.error("Error fetching truck control data:", error);
    }
  };

  const handleIconClick = (description, event) => {
    const iconRect = event.target.getBoundingClientRect();
    const popupX = iconRect.left + window.pageXOffset + 15;
    const popupY = iconRect.top + window.pageYOffset; // Adjust as needed
    setShowPopup(true);
    setPopupContent(description);
    // setPopupPosition({ x: popupX, y: popupY });
    setPopupPosition({
      top: `${event.clientY}px`,
      left: `${event.clientX}px`,
      transform: "translate(-50%, -50%)",
    });
  };

  const sortedTruckData = [
    ...truckData.filter((truck) => truck.truckId === searchedTruckNo),
    ...truckData.filter((truck) => truck.truckId !== searchedTruckNo),
  ];

  function toggleButton(button) {
    setToggledButtonName(button);
  }

  const handleRaiseAlert = () => {
    if (selectedTruckNo) {
      alert(`Alert raised for Truck No: ${selectedTruckNo}`);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupContent("");
  };

  const fetchTruckData = async () => {
    try {
      const response = await fetch(`${apiUrl}/truck-information`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setTruckData(data);
    } catch (error) {
      console.error("Error fetching truck information:", error);
    }
  };

  const fetchCollisionHistory = async () => {
    try {
      const response = await fetch(`${apiUrl}/collision-history`);
      if (!response.ok) {
        throw new Error("Failed to fetch collision history data");
      }
      const data = await response.json();
      setCollisionHistory(data);
    } catch (error) {
      console.error("Error fetching collision history:", error);
    }
  };

  return (
    <div className="usage_page">
      <div className="vehicle_cards_bar">
        <div className="vehicle_cards_text">
          <div
            className={activeButton === "Usage" ? "active" : ""}
            onClick={() => handleButtonClick("Usage")}
          >
            Usage
          </div>
        </div>
        <hr></hr>
        <div className="vehicle_cards_text">
          <Link
            to="/truckcontrol/efficiency"
            className="vehicle_link {activeButton === 'Efficiency' ? 'active' : ''}"
            onClick={() => handleButtonClick("Efficiency")}
          >
            Efficiency
          </Link>
        </div>
      </div>

      {activeButton === "Usage" && (
        <div className="usage_details">
          <div className="u_topcards">
            <div
              className={`u_scard ${
                toggledButtonName === "Asset Information" ? "active" : ""
              }`}
            >
              <button
                className="u_scard_button"
                onClick={() => toggleButton("Asset Information")}
              >
                <Link className="u_scard_link">
                  <img
                    src="/images/trin.png"
                    alt="Home"
                    className="u_scard_icon"
                  />
                  <span className="u_scard_text">Asset Information</span>
                </Link>
              </button>
            </div>
            <div
              className={`u_scard ${
                toggledButtonName === "Collision History" ? "active" : ""
              }`}
            >
              <button
                className="u_scard_button"
                onClick={() => toggleButton("Collision History")}
              >
                <Link className="u_scard_link">
                  <img
                    src="/images/col.png"
                    alt="Home"
                    className="u_scard_icon"
                  />
                  <span className="u_scard_text">Collision History</span>
                </Link>
              </button>
            </div>
          </div>

          {toggledButtonName === "Asset Information" && (
            <div className="u_card_details">
              <div className="u_truck_details">
                <table className="u_table_content">
                  <thead>
                    <tr>
                      <th>Vehicle No</th>
                      <th>Vehicle Model</th>
                      <th>
                        Dist. <br />
                        Travelled
                      </th>
                      <th>Location</th>
                      <th>
                        Idle <br />
                        Start Dt
                      </th>
                      <th>
                        Idle <br />
                        Start Time
                      </th>
                      <th>
                        Idle <br />
                        End Date
                      </th>
                      <th>
                        Idle <br />
                        End Time
                      </th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTruckData.map((truck, index) => (
                      <tr
                        key={index}
                        className={
                          selectedRowIndex === index ? "selected-row" : ""
                        }
                        onClick={() => handleTruckClick(index, truck.truckId)}
                      >
                        <td>{truck.truckId}</td>
                        <td>{truck.truckName}</td>
                        <td>{truck.distanceTravelled}</td>
                        <td>{truck.location}</td>
                        <td>{truck.idleStartDate}</td>
                        <td>{truck.idleStartTime}</td>
                        <td>{truck.idleEndDate}</td>
                        <td>{truck.idleEndTime}</td>
                        <td>{truck.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="alert_card_details">
                <div className="alert_access">
                  <div className="alert_scard">
                    <button className="alert_scard_button">
                      <span className="alert_scard_text"> Tire Pressure</span>
                      <br />
                      <span className="alert_scard_stext">
                        Abnormal Tire pressure
                      </span>
                      <br />
                      <br />
                      <span className="alert_scard_mt">
                        {tirePressure} / 80-100 PSI
                      </span>
                    </button>
                  </div>
                  <div className="alert_scard">
                    <button className="alert_scard_button">
                      <span className="alert_scard_text"> Brake System</span>
                      <br />
                      <span className="alert_scard_stext">Fluid Levels</span>
                      <br />
                      <br />
                      <span className="alert_scard_mt">
                        {brakeHealth} / Full
                      </span>
                    </button>
                  </div>
                  <div className="alert_scard">
                    <button className="alert_scard_button">
                      <span className="alert_scard_text"> Engine Health</span>
                      <br />
                      <span className="alert_scard_stext">
                        Temperature levels
                      </span>
                      <br />
                      <br />
                      <span className="alert_scard_mt">
                        {engineTemp} / 90 - 105 C
                      </span>
                    </button>
                  </div>
                  <div className="alert_scard">
                    <button className="alert_scard_button">
                      <span className="alert_scard_text"> Battery Health</span>
                      <br />
                      <span className="alert_scard_stext">
                        Battery Voltage Levels
                      </span>
                      <br />
                      <br />
                      <span className="alert_scard_mt">
                        {batteryHealth} / 13 - 15 V
                      </span>
                    </button>
                  </div>
                  <div className="alert_scard">
                    <button className="alert_scard_button">
                      <span className="alert_scard_text"> Fuel System</span>
                      <br />
                      <span className="alert_scard_stext">Low Fuel Level</span>
                      <br />
                      <br />
                      <span className="alert_scard_mt">
                        {fuelLevel} / 187 L
                      </span>
                    </button>
                  </div>
                </div>
                <div className="button_container">
                  <button className="raisealert" onClick={handleRaiseAlert}>
                    Raise Alert !
                  </button>
                </div>
              </div>
            </div>
          )}
          {toggledButtonName === "Collision History" && (
            <div className="u_card_details">
              <div className="u_collision_details">
                <table className="u_table_content">
                  <thead>
                    <tr>
                      <th>Vehicle No</th>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Time</th>
                      <th>Location</th>
                      <th>
                        Speed
                        <br /> mph
                      </th>
                      <th>
                        {" "}
                        Braking
                        <br /> m/s^2
                      </th>
                      <th>Collision</th>
                      <th>Severity</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collisionHistory.map((collision, index) => (
                      <tr key={index}>
                        <td>{collision.truckId}</td>
                        <td>{collision.date}</td>
                        <td>{collision.driverName}</td>
                        <td>{collision.time}</td>
                        <td>{collision.location}</td>
                        <td>{collision.speedMPH}</td>
                        <td>{collision.brakingMS2}</td>
                        <td>{collision.collisionType}</td>
                        <td>{collision.severity}</td>
                        <td>
                          <img
                            src="/images/note.png"
                            className="note_ic"
                            onClick={(event) =>
                              handleIconClick(collision.description, event)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {showPopup && (
                  <div className="popup" style={popupPosition}>
                    <div className="popup_content">
                      <span className="close" onClick={handleClosePopup}>
                        &times;
                      </span>
                      <p className="pp">{popupContent}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UsagePage;
