module.exports = (process.env.NODE_ENV === 'production')
    ? require('../config') 
    : require('../config.dev');
