module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('products', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            amount: {
                type: Sequelize.STRING,
                allowNull: false
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false
            },
            stock: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: true
            },
            color: {
                type: Sequelize.STRING,
                allowNull: true
            },
            model: {
                type: Sequelize.STRING,
                allowNull: true
            },
            brand: {
                type: Sequelize.STRING,
                allowNull: true
            },
            product_code: {
                type: Sequelize.BIGINT,
                allowNull: true
            },
            price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('products');
    }
};
