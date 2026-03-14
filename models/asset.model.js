const mongoose = require('mongoose');

function parseDateFlexible(v) {
  if (!v) return v;
  if (v instanceof Date) return v;
  if (typeof v === 'number') return new Date(v);
  if (typeof v === 'string') {
    const t = v.trim();
    const m = t.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/);
    if (m) {
      return new Date(parseInt(m[3]), parseInt(m[2]) - 1, parseInt(m[1]));
    }
    const d2 = new Date(t);
    if (!isNaN(d2.getTime())) return d2;
  }
  return v;
}

const costBreakdownSchema = new mongoose.Schema({
  category: { type: String, required: true },
  amount:   { type: Number, required: true },
}, { _id: false });

const assetSchema = new mongoose.Schema(
  {
    assetId: { type: String, required: true, unique: true },
    assetname: { type: String, required: [true, "PLEASE PROVIDE A NAME FOR THIS ASSET"] },
    assetCode: { type: Number, required: false, unique: true },
    projectName: { type: String, required: true },
    ImplementingAgency: { type: String, required: true },

    // ── Address ──
    pincode:           { type: String, required: false },
    district:          { type: String, required: true },
    block:             { type: String, required: true },
    gramPanchayat:     { type: String, required: false },
    village:           { type: String, required: true },
    fullPostalAddress: { type: String, required: false },  
    latitude:          { type: Number, required: true },
    longitude:         { type: Number, required: true },
    areaSize:          { type: Number, required: true },

    // ── Scheme & Funding ──
    schemeName:    { type: String, required: true },
    fundingSource: { type: String, required: true },

    // ── Cost ──
    projectCost:    { type: Number, required: false },  
    actualCost:     { type: Number, required: true },
    contractvalue:  { type: Number, required: true },
    costBreakdown:  { type: [costBreakdownSchema], default: [] },  

    // ── Work Order ──
    workorderNumber: { type: String, required: true },
    workorderDate:   { type: Date,   required: true, set: parseDateFlexible },

    // ── Timeline ──
    timeofcompletion:      { type: Number, required: true },
    constructionStartDate: { type: Date,   required: true, set: parseDateFlexible },
    constructionEndDate:   { type: Date,   required: true, set: parseDateFlexible },

    // ── Status ──
    pointofcontact:      { type: String, required: true },
    status:              { type: String, enum: ["Planned", "Ongoing", "Completed"], required: true },
    completionPercentage:{ type: Number, required: true },
    remarks:             { type: String, required: false },

    // ── Photos ──  
    photoConstructionSite:  { type: String, required: false },
    photoPriorConstruction: { type: String, required: false },
    photoBoundaryWall:      { type: String, required: false },
    photoRoad:              { type: String, required: false },
    photoSchoolBuilding1:   { type: String, required: false },
    photoSchoolBuilding2:   { type: String, required: false },
    otherPhotos:            { type: [String], default: [] },
  },
  { timestamps: true }
);

const Asset = mongoose.model("Asset", assetSchema);
module.exports = Asset;