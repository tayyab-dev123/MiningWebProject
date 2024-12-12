import mongoose from 'mongoose';

const miningMachineSchema = new mongoose.Schema({
  machineName: {
    type: String,
    required: [true, 'Machine name is required'],
    trim: true
  },
  hashrate: {
    type: String,
    required: [true, 'Hashrate is required']
  },
  powerConsumption: {
    type: Number,
    required: [true, 'Power consumption is required']
  },
  priceRange: {
    type: Number,
    required: [true, 'Price range is required']
  },
  coinsMined: {
    type: String,
    required: [true, 'Coins mined information is required']
  },
  monthlyProfit: {
    type: Number,
    required: [true, 'Monthly profit estimation is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  images: [{
    type: String  // Array of Cloudinary URLs
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
export default mongoose.model('MiningMachine', miningMachineSchema);
