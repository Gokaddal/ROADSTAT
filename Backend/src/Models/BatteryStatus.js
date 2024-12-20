import mongoose from 'mongoose';
const { models, model, Schema } = mongoose;

const BatteryStatusSchema = new Schema({
    truckId: { type: String, ref: 'Truck' },
    truckName: {type:String},
    batteryVoltage: { type: Number },
    chargeStatus: { type: String },
    healthPercentage: { type: Number },
    lastReplace: { type: Date },
}, { timestamps: true });

export const BatteryStatus = models?.BatteryStatus || model('BatteryStatus', BatteryStatusSchema);
    