const Item = require('../models/item');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');

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
        .populate({category})
        .exec();
    
    res.render('item_list', {title: 'Item List', item_list: allItems});
});

exports.item_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Item detail: ${req.params.id}`);
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Item create GET');
});

exports.item_create_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Item create POST');
});

exports.item_delete_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Item delete GET');
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Item delete POST');
});

exports.item_update_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Item update GET');
});

exports.item_update_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Item update POST');
});