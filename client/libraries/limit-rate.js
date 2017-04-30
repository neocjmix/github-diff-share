module.exports = function limitRate(interval) {
    let _index;
    let baseInterval = interval;
    
    return (callback, interval) => {
        if (_index) clearTimeout(_index);
        _index = setTimeout(callback, interval || baseInterval);
    };
};