const Asset = require('../models/product.model');

const getAssets = async (req, res) => {             

    try {
        const assets = await Asset.find();
        res.status(200).json(assets);
    }   catch (error) {             
        res.status(500).json({ message: error.message });
    }   
}

const getAssetsById = async (req, res) => {

    try {
        const {id} = req.params;
        const asset = await Asset.findById(id);
        res.status(200).json(asset);
        }catch (error) {
        res.status(500).json({ message:error.message});
    }
};

const createAssets = async (req,res) => {
    try {
        const created = await Asset.create(req.body);   
        res.status(201).json(created);
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
const updateAssets = async (req, res) => {
    try {
            const { id } = req.params;
            const updatedAsset = await Asset.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedAsset) {
                return res.status(404).json({ message: "Asset not found" });
            }
            res.status(200).json(updatedAsset);
        }
        catch (error) {
            res.status(500).json({ message:error.message});
        }

};

const deleteAssets = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAsset = await Asset.findByIdAndDelete(id);
        if (!deletedAsset) {
            return res.status(404).json({ message: "Asset not found" });
        }
        res.status(200).json({ message: "Asset deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message:error.message});
    }
};  

module.exports = {
    getAssets,
    createAssets,
    createAssets,
    updateAssets,
    deleteAssets,
};