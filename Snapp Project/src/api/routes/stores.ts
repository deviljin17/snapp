import express from 'express';
import { StoreService } from '../services/storeService';

const router = express.Router();
const storeService = new StoreService();

router.get('/product', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    const product = await storeService.getProductDetails(url);
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Store API error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch product details'
    });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const products = await storeService.findBestPrices(query);
    
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Store search error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search products'
    });
  }
});

// Cleanup on server shutdown
process.on('SIGTERM', async () => {
  await storeService.close();
});

export default router;