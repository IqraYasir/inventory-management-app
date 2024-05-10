const Category = require('../models/category');
const Item =  require('../models/item');
const asyncHandler = require('express-async-handler');

exports.category_list = asyncHandler(async(req, res, next) => {
    const allCategories = await Category
        .find()
        .sort({name: 1})
        .exec();
    
    res.render('category_list', {
        title: "Category List",
        category_list: allCategories
    });
});

exports.category_detail = asyncHandler(async(req, res,  next) => {
    const [category, allItemsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({category: req.params.id}).exec()
    ]);

    if (category === null) {
        const err = new Error('Category not found');
        err.status = 404;
        return next(err);
    }

    res.render('category_detail', {
        title: 'Category Detail',
        category: category,
        category_items: allItemsInCategory
    });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Category create GET');
});

exports.category_create_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Category create POST');
});

exports.category_delete_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Category delete GET');
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Category delete POST');
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Category update GET');
});

exports.category_update_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Category update POST');
});
