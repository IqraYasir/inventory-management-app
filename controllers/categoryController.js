const Category = require('../models/category');
const Item =  require('../models/item');

const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');

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
    res.render('category_form', {title: 'Create Category'});
});

exports.category_create_post = [
    body('name', 'Name must be specified.')
        .trim()
        .isLength({min: 1})
        .escape(),
    
    body('description', 'Description must not be empty.')
        .trim()
        .isLength({min: 1})
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const category = new Category({
            name: req.body.name,
            description: req.body.description
        });

        if (!errors.isEmpty()) {
            res.render('category_form', {
                title:'Create Category',
                category: category,
                errors: errors.array()
            });
            return;
        } else {
            await category.save()
            res.redirect(category.url);
        }
    })
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
    const [category, allItemsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({category: req.params.id}).exec()
    ]);

    if (category === null) {
        res.redirect('/home/categories');
    }

    res.render('category_delete', {
        title: 'Delete Category',
        category: category,
        category_items: allItemsInCategory
    });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
    const [category, allItemsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({category: req.params.id}).exec()
    ]);

    if (allItemsInCategory > 0) {
        res.render('category_delete', {
            title: 'Delete Category',
            category: category,
            category_items: allItemsInCategory
        });
        return;
    } else {
        await Category.findByIdAndDelete(req.body.categoryid);
        res.redirect('/home/categories');
    }
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Category update GET');
});

exports.category_update_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Category update POST');
});
