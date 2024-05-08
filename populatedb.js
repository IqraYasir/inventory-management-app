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
    ]);
};

async function createItems() {
    console.log('Adding books');
    await Promise.all([
        createItem(0, 'Canon EOS 2000D DSLR Camera',
            'Take Beautiful photos and movies with background blur. Easily connect, Shoot and Share on the move.',
            categories[0], 469.00, 10),
        createItem(1, 'Samsung Galaxy A25 5G Android Smartphone',
            'Fast Charging, 50MP Camera, Blue Black, 3 Year Manufacturer Extended Warranty.',
            categories[0], 209.00, 2),
        createItem(2, '9V Power Supply/Adapter Plug Power Cable',
            'High-quality power sources made up of High-quality materials, Safe and Reliable for your Rockjam Keyboard',
            categories[0], 10.99, 22),
        createItem(3, 'To Kill A Mockingbird Paperback Copy',
            'To Kill a Mockingbird is a coming-of-age story, an anti-racist novel, a historical drama and an example of the Southern writing tradition.',
            categories[2], 8.25, 5),
        createItem(4, 'The Republic Hardback Copy',
            'Plato\'s Republic is widely acknowledged as one of the most influential works in the history of philosophy.',
            categories[2], 8.99, 30),
        createItem(5, 'SHEEN NELLY Retro Thick Rectangle Chunky Sunglasses',
            'SHEEN NELLY has a modern interpretation of classical design. It has a fashionable frame. Thick square frames and integrated nasal bracket design.',
            categories[3], 16.90, 31),
        createItem(6, 'Women\'s Classic-Fit Lightweight Long-Sleeve V-Neck Jumper',
            'Close but Comfortable Fit with easy movement, a Modern, Classic layering piece for both Casual and Polished Looks.',
            categories[3], 20.90, 55),
        createItem(7, 'Runner sneakers with 70s design',
            'These casual Running Shoes are designed with Lightweight Materials to provide a Comfortable and Breathable fit.',
            categories[3], 23.99, 23),
        createItem(8, 'Maveeno Cream For Dry and Sensitive Skin, 500ml Body Lotion',
            'Fragrance Free and Clinically Proven to Hydrate and Soothe.',
            categories[4], 13.99, 5),
        createItem(9, 'Elizabeth Asden Prevage Anti-Aging Daily Serum',
            'A powerful Eye Serum, Boosted by 5 Age-defying ingredients.',
            categories[4], 52.04, 3),
    ]);
}
