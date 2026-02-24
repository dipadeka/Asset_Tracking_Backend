const express = require('express');
const Asset = require('../asset.model');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const assets = await Asset.find();
    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findById(id);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    res.status(200).json(asset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const created = await Asset.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAsset = await Asset.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedAsset) return res.status(404).json({ message: 'Asset not found' });
    res.status(200).json(updatedAsset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Asset.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Asset not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
