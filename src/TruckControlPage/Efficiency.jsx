import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Efficiency.css';

const apiUrl = import.meta.env.VITE_API_URL;

function EfficiencyPage({ updateHeader, updateButton }) {
    const [popupVisible, setPopupVisible] = useState(false);
    const [selectedTruckNo, setSelectedTruckNo] = useState(null);
    const [truckData, setTruckData] = useState([]);
    const [selectedRowIndex, setSelectedRowIndex] = useState(0);
    const [speed, setSpeed] = useState(null);
    const [truckId, setTruckID] = useState(null);
    const [fuelLevel, setFuelLevel] = useState(null);
    const [fuelPressure, setFuelPressure] = useState(null);
    const [COLevel, setCOLevels] = useState(null);
    const [NOXLevel, setNOXLevels] = useState(null);
    const [HCLevel, setHCLevels] = useState(null);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const truckNo = queryParams.get('truckNo');
    const [searchedTruckNo, setSearchedTruckNo] = useState(truckNo || '');

    useEffect(() => {
        if (truckData.length > 0) {
            const defaultSelectedTruckId = truckData[0].truckId;
            setSelectedTruckNo(defaultSelectedTruckId);
            fetchTruckControlData(defaultSelectedTruckId);
        }
    }, [truckData]);

    useEffect(() => {
        updateHeader('Truck Control / Efficiency');
        updateButton('Efficiency');
    }, [updateHeader, updateButton]);

    useEffect(() => {
        if (searchedTruckNo) {
            const foundIndex = truckData.findIndex(truck => truck.truckId === searchedTruckNo);
            if (foundIndex !== -1) {
                setSelectedRowIndex(0);
                setSelectedTruckNo(searchedTruckNo);
                fetchTruckControlData(searchedTruckNo);
            }
        }
    }, [searchedTruckNo, truckData]);

    const fetchTruckData = async () => {
        const response = await fetch(`${apiUrl}/truck-efficiency`);
        const data = await response.json();
        setTruckData(data);
    };

    useEffect(() => {
        fetchTruckData();
    }, []);

    const fetchTruckControlData = async (truckId) => {
        try {
            const response = await fetch(`${apiUrl}/truck-control/${truckId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch truck control data');
            }
            const data = await response.json();

            setTruckID(data?.truckId);
            setSpeed(data?.speed);
            setFuelLevel(data?.fuelLevel);
            setFuelPressure(data?.fuelPressure);
            setCOLevels(data?.COLevel);
            setNOXLevels(data?.NOXLevel);
            setHCLevels(data?.HCLevel);
        } catch (error) {
            console.error('Error fetching truck control data:', error);
        }
    };
    

    const handleTruckClick = async (index, truckId) => {
        setSelectedRowIndex(index);
        setSelectedTruckNo(truckId);
        fetchTruckControlData(truckId);
    };
    

    const handleAlertButtonClick = () => {
        setPopupVisible(true);
        fetchTruckControlData(truckId);
        const alertMessage = `Truck Number: ${truckId}\nSpeed: ${speed}\nFuel Level: ${fuelLevel}`;
        alert(alertMessage);
    };

    const filteredTruckData = truckData.filter(truck => truck.truckId === searchedTruckNo);
    const remainingTruckData = truckData.filter(truck => truck.truckId !== searchedTruckNo);
    const sortedTruckData = [...filteredTruckData, ...remainingTruckData];

    return (
        <div className='mains'>
            <div className='ef-card'>
                <table className='ef-table'>
                    <thead>
                        <tr>
                            <th>S No</th>
                            <th>Vehicle No</th>
                            <th>Service History</th>
                            <th>Level</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTruckData.map((truck, index) => (
                            
                            <tr key={index} className={selectedRowIndex === index ? 'selected-row' : ''} onClick={() => handleTruckClick(index, truck.truckId)}>
                                <td>{index + 1}</td>
                                <td>{truck.truckId}</td>
                                <td><Link to={`/maintenance?truckNo=${truck.truckId}`} className='click'>Click Here</Link></td>
                                <td>{truck.level}</td>
                                <td style={{ color: 
                                    truck.status === 'Good' ? 'yellow' :
                                    truck.status === 'Fair' ? 'orange' :
                                    truck.status === 'Excellent' ? 'green' : 'black'
                                }}>
                                    {truck.status}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='e-below'>
                <div className='e-mainprofile'>
                    <div className="e-content">
                        <div className='e-access'>
                            <div className='e-details'>
                                <p><strong>Vehicle Number : <span className='ef-td-col'>{truckId}</span></strong></p>
                                <p className="flex-container">
                                    <span><strong>Speed : <span className='ef-td-col'>{speed}</span></strong> </span>
                                    <span className="align-right"><strong>Fuel Level : <span className='ef-td-col'>{fuelLevel}</span></strong></span>
                                </p>
                                <p className="flex-container">
                                    <span><strong>Fuel Pressure : <span className='ef-td-col'>{fuelPressure}</span></strong> </span>
                                    <span className="align-right"><strong>CO Level : <span className='ef-td-col'>{COLevel}</span></strong></span>
                                </p>
                                <p className="flex-container">
                                    <span><strong>NOX Level : <span className='ef-td-col'>{NOXLevel}</span></strong> </span>
                                    <span className="align-right"><strong>HC Level : <span className='ef-td-col'>{HCLevel}</span></strong></span>
                                </p>
                            </div>
                            <Link to="#" className='click'>Click here for More</Link>
                        </div>
                        <div className='r-details'>
                            <span className='maint'>Mark for Maintenance 
                                <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                </label>
                            </span>
                            <button className='alerts' onClick={handleAlertButtonClick}>Alert Driver</button> {/* Implementing alert box */}
                        </div>
                    </div>
                </div>
                <div className='t-mainprofile'>
                    <div className="t-content">
                        <span className='tv'>Threshold Values</span>
                            <div className='t-access'>
                                <div className='t-details'>
                                <div className='table-container'>
                                    <table className='t-table'>
                                        <tbody>
                                            <tr>
                                                <td>CO</td>
                                                <td>20.7 g / bhp - hr</td>
                                            </tr>
                                            <tr>
                                                <td>N0x</td>
                                                <td>0.2  g / bhp - hr</td>
                                            </tr>
                                            <tr>
                                                <td>HC</td>
                                                <td>1.3 g / bhp - hr</td>
                                            </tr>

                                            <tr>
                                                <td>Fuel Pressure</td>
                                                <td>30 - 80 PSI</td>
                                            </tr>
                                            
                                            <tr>
                                                <td>Engine Temperature</td>
                                                <td>195°F to 220°F</td>
                                            </tr> 
                                            
                                            <tr>
                                                <td>Intake Air</td>
                                                <td>-40°F to 212°F</td>
                                            </tr>  
                                        </tbody>
                                    </table>
                                </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EfficiencyPage;
