module.exports = function (sequelize, Sequelize) {
    return sequelize.define('Setting', {
        id: {type: Sequelize.STRING(64), allowNull: false, primaryKey: true},
        type: {type: Sequelize.ENUM('int', 'string', 'list', 'bool'), allowNull: false},
        value: {type: Sequelize.TEXT, allowNull: false}
    }, {
        underscored: true,
        tableName: 'settings',
        timestamps: false
    });
}
