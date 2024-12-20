import { BrakeSystem } from '../../Models/BrakeSystem.js'; // Import BrakeSystem model

/**
 * GET route handler to fetch all brake system details
 */
export const getAllBrakeSystems = async (req, res) => {
    try {
        const brakes = await BrakeSystem.find();
        res.json(brakes);
    } catch (error) {
        console.error('Error fetching brake system details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * GET route handler to fetch brake system details by ID
 */
export const getBrakeSystemById = async (req, res) => {
    try {
        const { id } = req.params;
        const brake = await BrakeSystem.findById(id);
        if (!brake) {
            return res.status(404).json({ message: "Brake system details not found" });
        }
        res.json(brake);
    } catch (error) {
        console.error('Error fetching brake system details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * POST route handler to add a new brake system detail
 */
export const addBrakeSystem = async (req, res) => {
    try {
        const {
            truckId,
            truckName,
            padWear,
            fluidLevel,
            pressure,
            absStatus
        } = req.body;
        const brake = await BrakeSystem.create({
            truckId,
            truckName,
            padWear,
            fluidLevel,
            pressure,
            absStatus
        });
        res.json(brake);
    } catch (error) {
        console.error('Error adding brake system details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * PUT route handler to update brake system details by ID
 */
export const updateBrakeSystem = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            truckId,
            truckName,
            padWear,
            fluidLevel,
            pressure,
            absStatus
        } = req.body;

        const updatedBrake = await BrakeSystem.findByIdAndUpdate(id, {
            truckId,
            truckName,
            padWear,
            fluidLevel,
            pressure,
            absStatus
        }, { new: true });

        if (!updatedBrake) {
            return res.status(404).json({ message: "Brake system details not found" });
        }

        res.json(updatedBrake);
    } catch (error) {
        console.error('Error updating brake system details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * DELETE route handler to delete brake system details by ID
 */
export const deleteBrakeSystem = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBrake = await BrakeSystem.findByIdAndDelete(id);

        if (!deletedBrake) {
            return res.status(404).json({ message: "Brake system details not found" });
        }

        res.json({ message: "Brake system details deleted successfully" });
    } catch (error) {
        console.error('Error deleting brake system details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};