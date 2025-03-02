import {
  addProductService,
  deleteProductService,
  getAllProductService,
  getOneProductService,
  searchProductService,
  updateProductService,
} from "../services/productService.js";

export const getAllProductController = async (req, res) => {
  try {
    const results = await getAllProductService();
    return res.status(200).json({
      success: true,
      message: "Get all product successful",
      data: results,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getOneProductController = async (req, res) => {
  const { id } = req.params;
  try {
    const results = await getOneProductService(id);
    if (!results) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Get a product successful",
      data: results,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const addProductController = async (req, res) => {
  const objData = req.body;
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = req.file ? `${baseUrl}/${req.file.filename}` : null;
    const results = await addProductService(objData, imageUrl);
    return res.status(201).json({
      success: true,
      message: "Added product successful",
      data: results,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateProductController = async (req, res) => {
  const { id } = req.params;
  const objData = req.body;
  try {
    let imageUrl = objData.imageUrl;
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      imageUrl = `${baseUrl}/${req.file.filename}`;
    }
    const results = await updateProductService(id, objData, imageUrl);
    return res.status(200).json({
      success: true,
      message: "Updated product successful",
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteProductController = async (req, res) => {
  const { id } = req.params;
  try {
    const results = await deleteProductService(id);
    return res.status(200).json({
      success: true,
      message: "Deleted product successfull",
      data: results,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const searchProductController = async (req, res) => {
  const objData = req.body;
  console.log(Object.keys(objData), objData);
  try {
    if (!objData || Object.keys(objData).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Search parameters are required" });
    }
    const results = await searchProductService(objData);
    return res.status(200).json({
      success: true,
      message: "Search products successful",
      data: results,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
