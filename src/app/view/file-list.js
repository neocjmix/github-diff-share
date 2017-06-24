import fileTemplate from './file-list.hbs';

module.exports = function(eContainer, data){
    eContainer.innerHTML = fileTemplate(data);
};