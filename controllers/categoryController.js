import categoriesModel from "../models/categoryModel.js";
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(404).send({
        success: false,
        message: "Category name is required",
      });
    }

    const existingCategory = await categoriesModel.findOne({ name });
    if (existingCategory) {
      return res.status(201).send({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await new categoriesModel({
      name,
    }).save();

    res.status(200).send({
      success: true,
      message: "Category created successfully",
      category: category,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) {
      return res.status(204).send({
        success: false,
        message: "Name is required",
      });
    }

    const existingCategory = await categoriesModel.findById(id);
    if (!existingCategory) {
      return res.status(201).send({
        success: false,
        message: "Category not found",
      });
    }

    const category = await categoriesModel.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Updated Category Successfully",
      category,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getSingleCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await categoriesModel.findById(id);

    if (!category) {
      return res.status(201).send({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Category Found Successfully",
      category,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const category = await categoriesModel.find({});

    return res.status(200).send({
      success: true,
      message: "Category Found Successfully",
      category,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const existingCategory = await categoriesModel.findById(id);
    if (!existingCategory) {
      return res.status(201).send({
        success: false,
        message: "Category not found",
      });
    }

    const category = await categoriesModel.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      message: "Deleted Category Successfully",
      category,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteAllCategory = async (req, res) => {
  try {
    const category = await categoriesModel.deleteMany({});

    return res.status(200).send({
      success: true,
      message: "Deleted All Categories Successfully",
      deleteCount: category.deleteCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};
