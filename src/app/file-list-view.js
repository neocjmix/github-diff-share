import fileTemplate from 'resources/file-list.hbs';

module.exports = function(eContainer, data){
    eContainer.innerHTML = fileTemplate(data);
};