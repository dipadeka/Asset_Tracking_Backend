const mongoose = require('mongoose');

function parseDateFlexible(v) {
  if (!v) return v;
  if (v instanceof Date) return v;
  if (typeof v === 'number') return new Date(v);
  if (typeof v === 'string') {
    const t = v.trim();
    const m = t.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/);
    if (m) {
      const d = parseInt(m[1], 10);
      const mo = parseInt(m[2], 10);
      const y = parseInt(m[3], 10);
      return new Date(y, mo - 1, d);
    }
    const d2 = new Date(t);
    if (!isNaN(d2.getTime())) return d2;
  }
  return v;
}

const assetSchema = new mongoose.Schema(
  {
    assetId: {
      type: String,
      required: true,
      unique: true,
    },  
    assetname: {
      type: String,
      required: [true, "PLEASE PROVIDE A NAME FOR THIS ASSET"],
    },
    assetCode: {
      type: Number,
      required: true,
      unique: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    ImplementingAgency: {
      type: String,
      required: true,
    },  
    district: {
      type: String,
      required: true,
    },
    block: {
      type: String,
      required: true,
    },
    gramPanchayat: {
      type: String,
      required: true,
    },
    village: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    areaSize: {
      type: Number,
      required: true,
    },
    schemeName: {
      type: String,
      required: true,
    },
    fundingSource: {
      type: String,
      required: true,
    },
    estimatedCost: {
      type: Number,
      required: true,
    },
    actualCost: {
      type: Number,
      required: true,
    },
    contractvalue: {
      type: Number,
      required: true,
    },
    workorderNumber: {
      type: String,
      required: true,
    },
    workorderDate: {
      type: Date,
      required: true,
      set: parseDateFlexible,
    },
    timeofcompletion: {
      type: Number,
      required: true,
    },  
    pointofcontact: {
      type: String,
      required: true,
    },  
    constructionStartDate: {
      type: Date,
      required: true,
      set: parseDateFlexible,
    },
    constructionEndDate: {
      type: Date,
      required: true,
      set: parseDateFlexible,
    },
    status: {
      type: String,
      enum: ["Planned", "Ongoing", "Completed"],
      required: true,
    },
    completionPercentage: {
      type: Number,
      required: true,
    },
    remarks: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Asset = mongoose.model("Asset", assetSchema);
module.exports = Asset;

