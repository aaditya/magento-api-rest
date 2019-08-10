const MagentoAPI = require('../index');
const credentials = require('./credentials.json');

module.exports = new MagentoAPI(credentials);