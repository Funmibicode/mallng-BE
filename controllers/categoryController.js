import Category from '../models/CategoryModel.js'



// @desc Get all categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};



// @desc Create categories
const createCategories = async (req, res, next) => {
  try {
    const {name, desc} = req.body;

    if (!name) {
      res.status(400);
      throw new Error("please select a category");
    }

    const category = await Category.create({
      name,
      desc,
    });
    res.status(201).json({category});

  } catch (error) {
    next(error);
  }
};



// @desc Delete categories
const deleteCategories = async (req, res, next) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);

    if (!deleted) {
      res.status(404);
      throw new Error("Category not found");
}

    res.status(200).json({ msg: "Category deleted successfully" });
   
    } catch(error) {
      next(error);
    }
};




// @desc Update categories
const updateCategories = async (req, res, next) => {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      res.status(404);
      throw new Error("Category not found");
    }

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};




export {getCategories, createCategories, deleteCategories, updateCategories};