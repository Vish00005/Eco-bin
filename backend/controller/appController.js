const User = require("../models/userModel");
const Bin = require("../models/binModel");
const sendOTP = require("../utils/sendOtp");

const DEFAULT_BINS = [
  {
    id: 1,
    name: "DDIT Campus Hub",
    address: "College Road, Nadiad",
    lat: 22.6825,
    lng: 72.8805,
    distance: 0.4,
    time: "5 min walk",
    rating: 4.9,
    fill: 15,
    accepted: ["phone", "laptop", "cable", "charger"],
  },
  {
    id: 2,
    name: "Santram Mandir Collection Point",
    address: "Near Santram Temple Plaza",
    lat: 22.6915,
    lng: 72.859,
    distance: 1.2,
    time: "15 min walk",
    rating: 4.7,
    fill: 65,
    accepted: ["phone", "battery", "cable", "charger"],
  },
  {
    id: 3,
    name: "Nadiad Railway Station Bin",
    address: "Main Exit Gate, Station Road",
    lat: 22.6885,
    lng: 72.871,
    distance: 0.9,
    time: "12 min walk",
    rating: 4.4,
    fill: 88,
    accepted: ["phone", "battery", "charger"],
  },
  {
    id: 4,
    name: "Pij Road Smart Drop",
    address: "Near Vaniawad Circle",
    lat: 22.698,
    lng: 72.852,
    distance: 2.3,
    time: "30 min walk",
    rating: 4.2,
    fill: 30,
    accepted: ["battery", "cable", "laptop"],
  },
  {
    id: 5,
    name: "Mission Road Recycling",
    address: "Opposite Methodist Hospital",
    lat: 22.705,
    lng: 72.868,
    distance: 1.8,
    time: "22 min walk",
    rating: 4.5,
    fill: 52,
    accepted: ["phone", "battery", "laptop", "cable", "charger"],
  },
];

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports.getProfile = async (req, res, next) => {
  try {
    return res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    const { firstname, lastname, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(firstname ? { firstname: firstname.trim() } : {}),
        ...(lastname ? { lastname: lastname.trim() } : {}),
        ...(phone ? { phone: phone.trim() } : {}),
      },
      { new: true }
    ).select("-password -otp -otpExpiresAt");

    return res.json({ message: "Profile updated", user });
  } catch (err) {
    next(err);
  }
};

module.exports.getDashboard = async (req, res, next) => {
  try {
    const items = req.user.recycledItems || [];
    const totalPoints = items.reduce((sum, item) => sum + (item.pointsEarned || 0), 0);
    const totalValue = items.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);

    return res.json({
      user: req.user,
      stats: {
        totalItems: items.length,
        totalPoints,
        totalValue,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getBins = async (req, res, next) => {
  try {
    const dbBins = await Bin.find().lean();
    if (dbBins.length > 0) {
      const mapped = dbBins.map((b, idx) => ({
        id: b._id || idx + 1,
        name: b.Name,
        address: b.Type || "Smart E-Waste Bin",
        lat: Number(b.Lat),
        lng: Number(b.Long),
        distance: 1.0,
        time: "10 min walk",
        rating: 4.6,
        fill: b.Storage,
        accepted: ["phone", "battery", "laptop", "cable", "charger"],
      }));
      return res.json({ bins: mapped });
    }
    return res.json({ bins: DEFAULT_BINS });
  } catch (err) {
    return res.json({ bins: DEFAULT_BINS });
  }
};

module.exports.postRecycle = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    user.pendingRecycle = {
      itemName: req.body.itemName,
      category: req.body.type,
      quantity: Number(req.body.quantity) || 1,
      estimatedPrice: Number(req.body.price) || 0,
      pointsEarned: Number(req.body.points) || 0,
      condition: req.body.condition || "damaged",
      usagePeriod: req.body.usage || "1-3",
      imageUrl: req.file?.path || "/wastes-570x570.jpg",
      recycledAt: req.body.recycledAt ? new Date(req.body.recycledAt) : new Date(),
    };

    await user.save();

    const delivery = await sendOTP(user.email, otp);

    return res.json({
      message: "OTP sent to your registered email",
      channel: delivery.channel,
      ...(delivery.channel === "console" ? { devOtp: otp } : {}),
    });
  } catch (err) {
    next(err);
  }
};

module.exports.resendOtp = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.pendingRecycle) {
      return res.status(400).json({ error: "No pending recycle submission found" });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    const delivery = await sendOTP(user.email, otp);

    return res.json({
      message: "New OTP sent",
      channel: delivery.channel,
      ...(delivery.channel === "console" ? { devOtp: otp } : {}),
    });
  } catch (err) {
    next(err);
  }
};

module.exports.verifyOtp = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user._id);

    if (!user || !user.otp || user.otp !== String(otp).trim() || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    if (!user.pendingRecycle) {
      return res.status(400).json({ error: "No pending recycle item to verify" });
    }

    user.recycledItems.push(user.pendingRecycle);
    user.pendingRecycle = null;
    user.otp = undefined;
    user.otpExpiresAt = undefined;

    await user.save();

    return res.json({
      message: "Item verified and added to your recycled items!",
      recycledItems: user.recycledItems,
    });
  } catch (err) {
    next(err);
  }
};
