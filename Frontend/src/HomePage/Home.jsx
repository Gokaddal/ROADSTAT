import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import MapComponent from "./MapComponent";
import "./Home.css";

const apiUrl = import.meta.env.VITE_API_URL;

function HomePage({ updateHeader, updateButton }) {
  const [currentTime, setCurrentTime] = useState("");
  const [weather, setWeather] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("");
  const [truckData, setTruckData] = useState([]);
  const [activeButton, setActiveButton] = useState("Assets");
  const [truckLocations, setTruckLocations] = useState([]);
  const [filteredTruckData, setFilteredTruckData] = useState([]);
  const [selectedTruckNo, setSelectedTruckNo] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const truckNo = queryParams.get("truckNo");
  const [searchedTruckNo, setSearchedTruckNo] = useState(truckNo || "");

  const [alertData, setAlertData] = useState([]);

  useEffect(() => {
    updateHeader("Home");
    updateButton("Home");
  }, [updateHeader, updateButton]);

  const fetchAlertData = async () => {
    try {
      const response = await fetch(`${apiUrl}/alerts`);
      const data = await response.json();
      setAlertData(data);
    } catch (error) {
      console.error("Error fetching alert data:", error);
      setAlertData([]);
    }
  };

  const handleButtonClick = async (buttonName) => {
    setActiveButton(buttonName);
    if (buttonName === "Locations") {
      await fetchTruckLocations();
    } else if (buttonName === "Alerts") {
      await fetchAlertData();
    }
  };

  const handleMapButtonClick = async (truckNo) => {
    setActiveButton("Locations");
    if (truckNo) {
      await fetchTruckLocations();
      setSelectedTruckNo(truckNo);
    }
  };

  const fetchTruckLocations = async () => {
    try {
      const response = await fetch(`${apiUrl}/truck-location`);
      const data = await response.json();
      setTruckLocations(data);
    } catch (error) {
      console.error("Error fetching truck locations:", error);
      setTruckLocations([]);
    }
  };

  useEffect(() => {
    setFilteredTruckData(truckData);
  }, [truckData]);

  const handleStatusFilter = (status) => {
    const filteredData = truckData.filter((truck) => truck.status === status);
    const otherData = truckData.filter((truck) => truck.status !== status);
    setFilteredTruckData([...filteredData, ...otherData]);
  };

  useEffect(() => {
    setFilteredTruckData(truckData);
    const searchedTruckIndex = truckData.findIndex(
      (truck) => truck.truckId === searchedTruckNo
    );
    let sortedTruckData = [...truckData];
    if (searchedTruckIndex !== -1) {
      const searchedTruck = sortedTruckData.splice(searchedTruckIndex, 1)[0];
      sortedTruckData = [searchedTruck, ...sortedTruckData];
    }
    setFilteredTruckData(sortedTruckData);
  }, [truckData, searchedTruckNo]);

  const handleIconClick = (description, event) => {
    const iconRect = event.target.getBoundingClientRect();
    const popupX = iconRect.left + window.pageXOffset + 15;
    const popupY = iconRect.top + window.pageYOffset;
    const contentAfterIs = description.split("is")[1].trim();
    setShowPopup(true);
    setPopupContent(contentAfterIs);
    setPopupPosition({ x: popupX, y: popupY });
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupContent("");
  };

  const handleRowClick = (index, truckId) => {
    window.location.href = `/truckcontrol/usage?truckNo=${truckId}`;
  };

  useEffect(() => {
    const fetchWeather = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const apiKey = import.meta.env.VITE_OPEN_WEATHER_API;
          const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
          try {
            const response = await fetch(apiURL);
            const data = await response.json();
            const temperature = data.main.temp;
            setWeather(`${temperature}° C`);
            setWeatherIcon(
              `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
            );
          } catch (error) {
            console.error("Error fetching weather data:", error);
            setWeather("N/A");
            setWeatherIcon("");
          }
        });
      } else {
        console.error("Geolocation is not supported by this browser.");
        setWeather("N/A");
        setWeatherIcon("");
      }
    };
    const updateCurrentTime = () => {
      const date = new Date();
      const formattedTime = `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}${
        date.getHours() >= 12 ? "pm" : "am"
      }`;
      setCurrentTime(formattedTime);
    };

    const fetchTruckData = async () => {
      const response = await fetch(`${apiUrl}/trucks`);
      const data = await response.json();
      setTruckData(data);
    };

    fetchWeather();
    fetchTruckData();

    updateCurrentTime();
    const interval = setInterval(() => {
      updateCurrentTime();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home_page">
      <div className="info_bar">
        <div className="info">
          <img src="/images/clock.png" alt="Home" className="info-icon" />
          <span className="info_text">{currentTime}</span>
        </div>
        <div className="info">
          {weatherIcon && (
            <img src={weatherIcon} alt="Weather Icon" className="info-icon" />
          )}
          <span className="info_text">{weather}</span>
        </div>
      </div>

      <div className="cards_bar">
        <div className="cards_text">
          <div
            className={activeButton === "Assets" ? "active" : ""}
            onClick={() => handleButtonClick("Assets")}
          >
            Assets
          </div>
        </div>
        <hr></hr>
        <div className="cards_text">
          <div
            className={activeButton === "Locations" ? "active" : ""}
            onClick={() => handleButtonClick("Locations")}
          >
            Locations
          </div>
        </div>
        <hr></hr>
        <div className="cards_text">
          <div
            className={activeButton === "Alerts" ? "active" : ""}
            onClick={() => handleButtonClick("Alerts")}
          >
            Alerts
          </div>
        </div>
      </div>
      {activeButton === "Assets" && (
        <div className="card_details">
          <table className="table_content">
            <thead>
              <tr>
                <th>S No</th>
                <th>Vehicle No</th>
                <th>Driver Id</th>
                <th>Location</th>
                <th>Incidents</th>
                <th>
                  Status
                  <img
                    src="/images/sort.png"
                    onClick={() => handleStatusFilter("Yes")}
                    className="filter_button"
                  />
                </th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {filteredTruckData.length > 0 ? (
                filteredTruckData.map((truck, index) => (
                  <tr
                    key={index}
                    className={
                      truck.truckId === searchedTruckNo ? "selected-row" : ""
                    }
                  >
                    <td>{index + 1}</td>
                    <td
                      className="hovertable"
                      onClick={() => handleRowClick(index, truck.truckId)}
                    >
                      {truck.truckId}
                    </td>
                    <td>{truck.driverId}</td>
                    <td>
                      <Link
                        to="#"
                        onClick={() => handleMapButtonClick(truck.truckId)}
                        className="click"
                      >
                        Click Here
                      </Link>
                    </td>
                    <td>{truck.incidents}</td>
                    <td>
                      {truck.status === "Yes" ? (
                        <img
                          src="/images/yes.png"
                          alt="Yes"
                          className="status_image"
                        />
                      ) : (
                        <img
                          src="/images/no.png"
                          alt="No"
                          className="status_image"
                        />
                      )}
                    </td>
                    <td>{truck.note}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeButton === "Alerts" && (
        <div className="card_details">
          <table className="table_content">
            <thead>
              <tr>
                <th>Vehicle No</th>
                <th>Metric</th>
                <th>Message</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {alertData.length > 0 ? (
                alertData.map((alert, index) => (
                  <tr key={index}>
                    <td>{alert.truckId}</td>
                    <td>{alert.metric}</td>
                    <td>
                      {alert.message.includes("is") ? (
                        <>
                          {alert.message.split("is")[0]}
                          <img
                            src="/images/note.png"
                            className="note-ich"
                            onClick={(event) =>
                              handleIconClick(alert.message, event)
                            }
                          />
                        </>
                      ) : (
                        alert.message
                      )}
                    </td>
                    <td>{alert.createdAt}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {showPopup && (
            <div
              className="popup"
              style={{
                position: "absolute",
                top: popupPosition.y,
                left: popupPosition.x,
              }}
            >
              <div className="popup-content">
                <span className="close" onClick={handleClosePopup}>
                  &times;
                </span>
                <p className="pp">{popupContent}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeButton === "Locations" && (
        <div
          className="card_details"
          style={{ height: "50vh", overflow: "hidden" }}
        >
          <MapComponent
            truckLocations={truckLocations}
            selectedTruckNo={selectedTruckNo}
          />
        </div>
      )}
    </div>
  );
}

export default HomePage;
