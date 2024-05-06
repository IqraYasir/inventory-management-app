const userArgs = process.argv.slice(2);

const Category = require('./models/category');
const Item = require('./models/item');

const categories = [];
const items = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch(err => console.log(err));

async function main() {
    console.log('Debug: About to connect');
    await mongoose.connect(mongoDB);
    console.log('Debug: Should be connected');
    await createCategories();
    await createItems();
    console.log('Debug: Closing mongoose');
    mongoose.connection.close();
};

async function createCategory(index, name, description) {
    const categorydetail = {name: name, description: description};
    const category = new Category(categorydetail);

    await category.save();
    categories[index] = category;
    console.log(`Added category: ${name}`);
};

async function createItem(index, name, description, category, price, number_in_stock) {
    const itemdetail = {
        name: name,
        description: description,
        category: category,
        price: price,
        number_in_stock: number_in_stock
    };
    const item = new Item(itemdetail);
    await item.save();
    items[index] = item;
    console.log(`Added item: ${name}`);
};

// Note the plural nouns
async function createCategories() {
    console.log('Adding categories');
    await Promise.all([
        createCategory(0, 'Electronics', 'Electronic equipment intended for everyday consumption.'),
        createCategory(1, 'Furniture', 'Homely sofas, tables and more.'),
        createCategory(2, 'Books', 'Bound pieces of paper, transmitting knowledge.'),
        createCategory(3, 'Fashion', 'Clothes that look nice.'),
        createCategory(4, 'Self care', 'Get glistening skin with these wide selection of items.'),
        createCategory(5, 'Kitchen', 'Appliances for use in the kitchen.')
    ])
}
