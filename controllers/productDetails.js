const productService = require("../services/productService");

//insert product
exports.insertGiftProduct = async (req, res) => {
    const { productName, productPrice, categoryId } = req.body;
    
    if (!productName  || !productPrice || !categoryId) { 
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const productImgfile = req.file // If no file is uploaded, pass null
    console.log('productImgfile', req.file)

    try {
        const result = await productService.insertServiceProduct(productName, productPrice, categoryId, productImgfile);
        return res.status(200).json({ success: true, message: result });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: error });
    }
};

//update product
exports.updateProduct = async (req, res) => {
  const { productId, productName, productPrice, categoryId } = req.body;

  if (!productId || !productName  || !productPrice) {
    return res.status(400).json({ success: false, message: "Product ID, Name and Price are required" });
  }

  const file = req.file || null; // If no file is uploaded, pass null

  try {
    const result = await productService.updateServiceProduct(productId, productName, productPrice,categoryId, file);
    return res.status(200).json({ success: true, message: result });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, error });
  }
};



///delete product
exports.deleteProduct = async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ success: false, message: "Product ID is required" });
  }

  try {
    const result = await productService.deleteServiceProduct(productId);
    return res.status(200).json({ success: true, message: result });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};