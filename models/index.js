const { Sequelize } = require('sequelize');
const config = require('../config/config.json');

let sequelize;

if (process.env.NODE_ENV === 'test') {
    // Use SQLite for testing
    sequelize = new Sequelize(config.test.database, config.test.username, config.test.password, {
        host: config.test.host,
        dialect: config.test.dialect,
        storage: config.test.storage,
        logging: false
    });
} else {
    // Use PostgreSQL for development
    sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
        host: config.development.host,
        dialect: config.development.dialect
    });
}

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Book = require('./book')(sequelize, Sequelize);
db.Member = require('./member')(sequelize, Sequelize);
db.Borrowing = require('./borrowing')(sequelize, Sequelize);
db.ReadingProgress = require('./readingProgress')(sequelize, Sequelize);

module.exports = db;
