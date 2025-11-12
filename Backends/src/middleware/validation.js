const validateProduct = (req, res, next) => {
  const { name, costPrice, sellingPrice, currentStock } = req.body;
  
  if (!name || !costPrice || !sellingPrice || currentStock === undefined) {
    return res.status(400).json({ 
      error: 'Name, costPrice, sellingPrice, and currentStock are required' 
    });
  }

  if (costPrice < 0 || sellingPrice < 0 || currentStock < 0) {
    return res.status(400).json({ 
      error: 'Prices and stock cannot be negative' 
    });
  }

  next();
};

const validateSale = (req, res, next) => {
  const { saleItems, customerId } = req.body;
  
  if (!saleItems || !Array.isArray(saleItems) || saleItems.length === 0) {
    return res.status(400).json({ 
      error: 'Sale items are required and must be a non-empty array' 
    });
  }

  next();
};

module.exports = { validateProduct, validateSale };
