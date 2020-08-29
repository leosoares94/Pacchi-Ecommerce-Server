'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('users', 'avatar_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'avatars',
                key: 'id',
                as: 'avatar_id'
            },
            onDelete: 'CASCADE'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('users', 'avatar_id');
    }
};
