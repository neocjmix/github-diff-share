import fileTemplate from 'resources/file.hbs';

module.exports = function(eContainer, data){
    eContainer.innerHTML = fileTemplate(data);
    [].slice.apply(eContainer.querySelectorAll('.chunk'))
        .forEach(eChunk =>
            eChunk.addEventListener('change', e =>
                eChunk.dataset.status = eChunk.querySelector('.ui input:checked').value));
};