'use strict';

import 'resources/index.html';
import 'resources/style.less';
import 'prismjs/themes/prism-coy.css'

import 'babel-polyfill';
import Prism from 'prismjs'
import parse from 'parse-diff';
import config from 'config';
import limitRate from 'libraries/limit-rate';
import props from 'resources/props';
import fileTemplate from 'resources/file.hbs';



const eUrlInput = document.getElementById('url');
const eContentDiv = document.getElementById('content');
const twicePerSecond = limitRate(500);
const selectLanguages = (languagesMap =>
        extension => {
            const matchingLanguages = Object.entries(languagesMap)
                .filter(entry => entry[1].includes(extension))
                .map(entry => entry[0]);

            return Prism.languages[matchingLanguages.length > 0 ? matchingLanguages[0] : "clike"];
        }
)(props.languages);




function isValidGithubCommitDiffUrl(url){
    return !!url.match(/^https:\/\/github.com\/.+\/commit\/.+.diff$/);
}

function setInputValidity(eInput, isValid){
    if(isValid){
        eInput.className = eInput.className.replace(/ (in)?valid( |$)/, "");
        eInput.className += " valid";
        return true;
    }

    if(eInput.value.length === 0){
        eInput.className = eInput.className.replace(/ (in)?valid( |$)/, "");
        return false;
    }
    
    eInput.className = eInput.className.replace(/ (in)?valid( |$)/, "");
    eInput.className += " invalid";
    return false;
}

function formatChunks(files) {
    return files.map(file => Object.assign({}, file, {
        chunks : file.chunks.map(chunk => {
            const code = chunk.changes
                .map(change => change.content.slice(1))
                .reduce((line1, line2)=>line1 + '\n' + line2);

            return Object.assign({}, chunk, {
                changes : Prism.highlight(code, selectLanguages(file.to.match("(\\.)([^\\.]*$)")[2]))
                    .split('\n')
                    .map((line, index) => Object.assign({}, chunk.changes[index], {
                        content: line
                    }))
            });
        })
    }));
}

function setChunkUi(eChunk) {
    eChunk.addEventListener('click', e =>
        eChunk.dataset.status = e.target.matches('.ui button')
            ? e.target.dataset.targetStatus
            : eChunk.dataset.status);
}

function fireClickEvent(element){
    var event = document.createEvent('HTMLEvents');
    event.initEvent('click', true, false);
    element.dispatchEvent(event)
}

function changeUrl(inputElement){
    const url = inputElement.value.replace(/(.diff)?$/, ".diff");
    if(!setInputValidity(inputElement, isValidGithubCommitDiffUrl(url))) return;
    
    twicePerSecond(() => {
        history.replaceState({},"","?url="+url);
        loadPageViaProxyServer(url, config.serverRoot + "/load")
            .then(parse)
            .then(formatChunks)
            .then(fileTemplate)
            .then(html => {
                eContentDiv.innerHTML = html;
                [].slice.apply(eContentDiv.querySelectorAll('.chunk')).forEach(setChunkUi);
                [].slice.apply(eContentDiv.querySelectorAll('.chunk .ui button[data-target-status=both]')).forEach(fireClickEvent);
            })
    });
}

function loadPageViaProxyServer(url, proxyUrl){
    return fetch(proxyUrl + '?url=' + url)
        .then(response=>{
            if (!response.ok) {
               throw Error(response.statusText);
            }
            return response.text()
        })
}

if(location.search.indexOf('url=') >= 0){
    eUrlInput.value = location.search.replace('?url=','');
    changeUrl(eUrlInput);
}

eUrlInput.addEventListener('input', e => changeUrl(e.target));

