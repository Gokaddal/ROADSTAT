import { TruckControl } from '../Models/TruckControl.js';
import { Alert } from '../Models/Alert.js';
import { Warning } from '../Models/Warning.js';

// GET route handler for fetching all alerts
export const getAllAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find();
        res.json(alerts);
    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET route handler for fetching all warnings
export const getAllWarnings = async (req, res) => {
    try {
        const warnings = await Warning.find();
        res.json(warnings);
    } catch (error) {
        console.error('Error fetching warnings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// POST route handler for tracking truck metrics
export const trackTruckMetrics = async (req, res) => {
    try {
        const { truckId } = req.params;
        const metrics = req.body;

        // console.log("inside", req.body);
    // console.log(req.body);
    // const fetchMetrics = async () => {
    //   try {
    //     const response = await fetch(`http://localhost:3000/api/truck-control/${truckId}`);
    //     if (!response.ok) {
    //         throw new Error('Failed to fetch truck control details');
    //     }
    //     const metrics = await response.json();
    //     return metrics; // Return the fetched metrics
    //   } catch (error) {
    //       console.error('Error fetching truck control details', error);
    //       throw error; // Rethrow or handle as needed
    //   }
    // };

    // const metrics = await fetchMetrics();
    // console.log(metrics);
        let trackedMetrics = {};
        let alerts = [];
        let warnings = [];

        // Define standard ranges and alert thresholds for each metric
        const metricRanges = {
            speed: { min: 55, max: 70, minWarningThreshold: 55, maxWarningThreshold: 80 },
            fuelLevel: { min: 40, max: 300, minWarningThreshold: 30, maxWarningThreshold: 300 },
            fuelPressure: { min: 30, max: 70, minWarningThreshold: 20, maxWarningThreshold: 80 },
            engineTemp: { min: 180, max: 220, minWarningThreshold: 170, maxWarningThreshold: 230 },
            COLevel: { min: 1.9, max: 3.1, minWarningThreshold: 1.5, maxWarningThreshold: 3.5 },
            NOXLevel: { min: 0.12, max: 0.31, minWarningThreshold: 0.05, maxWarningThreshold: 0.4 },
            HCLevel: { min: 0.06, max: 0.19, minWarningThreshold: 0.03, maxWarningThreshold: 0.25 },
            tirePressure: { min: 80, max: 100, minWarningThreshold: 70, maxWarningThreshold: 110 },
            brakeHealth: { min: 212, max: 302, minWarningThreshold: 200, maxWarningThreshold: 310 },
            batteryHealth: { min: 11.8, max: 100, minWarningThreshold: 5, maxWarningThreshold: 100 },
        };

        // Track metrics against standard ranges and generate alerts or warnings if necessary
        for (let [key, value] of Object.entries(metrics)) {
            let range = metricRanges[key];
            if (range) {
                trackedMetrics[key] = {
                    value,
                    withinRange: value >= range.min && value <= range.max,
                    min: range.min,
                    max: range.max,
                };

                let flag1 = 0;
                let flag2 = 0;

                if (value < range.min || value > range.max) {
                    let type = value < range.minWarningThreshold || value > range.maxWarningThreshold ? 'alert' : 'warning';
                    if (type === 'alert') { if (value < range.minWarningThreshold) flag1 = 1 }
                    if (type === 'warning') { if (value < range.min) flag2 = 1 }
                    let message = `${key} value (${value}) is ${flag1 === 1 || flag2 === 1 ? 'below' : 'above'} the ${flag1 === 1 || flag2 === 1 ? 'minimum' : 'maximum'} threshold (${range.min} to ${range.max}).`;

                    if (type === 'alert') {
                        let alert = await Alert.create({
                            truckId,
                            metric: key,
                            value,
                            message
                        });
                        alerts.push(alert);
                    } 
                    if (type === 'warning')  {
                        let warning = await Warning.create({
                            truckId,
                            metric: key,
                            value,
                            message
                        });
                        // res.json(warning)
                        warnings.push(warning);
                    }
                }
            }
        }
        // Respond with tracked metrics, alerts, and warnings
        res.json({ trackedMetrics, alerts, warnings });
    } catch (error) {
        console.error('Error tracking truck metrics:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// DELETE route handler for deleting a single warning by ID
export const deleteWarningById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedWarning = await Warning.findByIdAndDelete(id);
        if (!deletedWarning) {
            return res.status(404).json({ message: "Warning not found" });
        }
        res.json({ message: "Warning deleted successfully" });
    } catch (error) {
        console.error('Error deleting warning:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// DELETE route handler for deleting a single alert by ID
export const deleteAlertById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAlert = await Alert.findByIdAndDelete(id);
        if (!deletedAlert) {
            return res.status(404).json({ message: "Alert not found" });
        }
        res.json({ message: "Alert deleted successfully" });
    } catch (error) {
        console.error('Error deleting alert:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// DELETE route handler for deleting all alerts
export const deleteAllAlerts = async (req, res) => {
    try {
        await Alert.deleteMany();
        res.json({ message: 'All alerts deleted successfully' });
    } catch (error) {
        console.error('Error deleting alerts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// DELETE route handler for deleting all warnings
export const deleteAllWarnings = async (req, res) => {
    try {
        await Warning.deleteMany();
        res.json({ message: 'All warnings deleted successfully' });
    } catch (error) {
        console.error('Error deleting warnings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};