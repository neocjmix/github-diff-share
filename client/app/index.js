'use strict';

import 'babel-polyfill';
import 'resources/style.less';
import 'resources/index.html';
import config from 'config';
import parse from 'parse-diff';
import withDelay from 'libraries/with-delay';
import props from 'resources/props';
import fileTemplate from 'resources/file.hbs';


const eUrlInput = document.getElementById('url');
const eContentDiv = document.getElementById('content');
const handleUrlChange = withDelay(500);

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

function mapLines(files, mapperFunc) {
    return files.map(file => Object.assign(file, {
        chunks : file.chunks.map(chunk => Object.assign(chunk, {
            changes : chunk.changes.map(change => Object.assign(change, {
                content : mapperFunc(change.content)
            }))
        }))
    }));
}

function changeUrl(inputElement){
    const url = inputElement.value.replace(/(.diff)?$/, ".diff");
    if(!setInputValidity(inputElement, isValidGithubCommitDiffUrl(url))) return;
    
    handleUrlChange(() => 
        loadPageViaProxyServer(url, config.serverRoot+"/load")
            .then(parse)
            .then(files => mapLines(files, line => line.slice(1)))
            .then(fileTemplate)
            .then(html => eContentDiv.innerHTML = html)
            .catch(err => console.error(err)));
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

eUrlInput.addEventListener('input', e => changeUrl(e.target));
if(location.search.indexOf('url=') >= 0){
    eUrlInput.value = location.search.replace('?url=','');
    changeUrl(eUrlInput);
}

// eUrlInput.addEventListener('paste', changeUrl);