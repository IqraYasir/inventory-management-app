const Item = require('../models/item');
const Category = require('../models/category');

const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');

exports.index = asyncHandler(async (req, res, next) => {
    const [
        numItems,
        numCategories
    ] = await Promise.all([
        Item.countDocuments({}).exec(),
        Category.countDocuments({}).exec()
    ]);

    res.render('index', {
        title: 'Homepage',
        item_count: numItems,
        category_count: numCategories
    });
});
  
exports.item_list = asyncHandler(async (req, res, next) => {
    const allItems = await Item.find({}, 'name description')
        .sort({name: 1})
        .populate('category')
        .exec();
    
    res.render('item_list', {title: 'Item List', item_list: allItems});
});

exports.item_detail = asyncHandler(async (req, res, next) => { 
    const item = await Item.findById(req.params.id).populate('category').exec();

    if (item === null) {
        const err = new Error('Item not found');
        err.status = 404;
        return next(err);
    }

    res.render('item_detail', {
        title: item.name,
        item: item
    });
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
    const allCategories = await Category
        .find()
        .sort({name: 1})
        .exec()

    res.render('item_form', {
        title: 'Create Item',
        categories: allCategories
    })
});

exports.item_create_post = [
    body('name', 'Name must be specified.')
        .trim()
        .isLength({min: 1})
        .escape(),
        
    body('description', 'Description must be specified.')
        .trim()
        .isLength({min: 1})
        .escape(),

    body('category', 'Category must be specified.')
        .trim()
        .isLength({min: 1})
        .escape(),

    body('price')
        .trim()
        .isFloat({min: 0})
        .withMessage('Price must be a number.')
        .isLength({min: 1})
        .escape()
        .withMessage('Price must be specified.'),
        
    body('number_in_stock')
        .trim()
        .isInt({min: 0})
        .withMessage('Number in stock must be a number.')
        .isLength({min: 1})
        .escape()
        .withMessage('Number in stock must be specified.'),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);
        
        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock
        });

        if (!errors.isEmpty()) {
            const allCategories = await Category
                .find()
                .sort({min: 1})
                .exec()
            
            res.render('item_form', {
                title: 'Create Item',
                categories: allCategories,
                item: item,
                errors: errors.array()
            });
        } else {
            await item.save();
            res.redirect(item.url);
        }
    })
];

exports.item_delete_get = asyncHandler(async (req, res, next) => {
    const item = Item.findById(req.params.id).exec();
    if (item === null) {
        res.redirect('/home/items');
    }
    
    res.render('item_delete', {
        title: 'Delete Item',
        item: item
    });
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
    await Item.findByIdAndDelete(req.body.itemid);
    res.redirect('/home/items');
});

exports.item_update_get = asyncHandler(async (req, res, next) => {
    const [item, allCategories] = await Promise.all([
        Item.findById(req.params.id).exec(),
        Category.find().sort({name: 1}).exec()
    ]);

    if (item === null) {
        const err = new Error('Item not found');
        err.status = 404;
        return next(err);
    }

    res.render('item_form', {
        title: 'Update Item',
        categories: allCategories,
        item: item
    });
});

exports.item_update_post = [
    body('name', 'Name must be specified.')
        .trim()
        .isLength({min: 1})
        .escape(),
        
    body('description', 'Description must be specified.')
        .trim()
        .isLength({min: 1})
        .escape(),

    body('category', 'Category must be specified.')
        .trim()
        .isLength({min: 1})
        .escape(),

    body('price')
        .trim()
        .isFloat({min: 0})
        .withMessage('Price must be a number.')
        .isLength({min: 1})
        .escape()
        .withMessage('Price must be specified.'),
        
    body('number_in_stock')
        .trim()
        .isInt({min: 0})
        .withMessage('Number in stock must be a number.')
        .isLength({min: 1})
        .escape()
        .withMessage('Number in stock must be specified.'),

    asyncHandler(async (req, res, next) => {
        const errors = validationrResult(req);

        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            const allCategories = await Category
                .find()
                .sort({name: 1})
                .exec()
            
            res.render('item_form', {
                title: 'Update Item',
                categories: allCategories,
                item: item,
                errors: errors.array()
            });
            return;
        } else {
            const updatedItem = await Item.findByIdAndUpdate(
                req.params.id, item, {} 
            );
            res.redirect(updatedItem.url);
        }
    })
];