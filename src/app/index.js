'use strict';

import 'resources/index.html';
import 'resources/style.less';
import 'prismjs/themes/prism-coy.css'
import 'babel-polyfill';
import Prism from 'prismjs'
import parse from 'parse-diff';
import limitRate from 'libraries/limit-rate';
import selectLanguages from 'app/select-language';
import mainView from 'app/main-view';
import fileListView from 'app/file-list-view';

const eUrlInput = document.getElementById('url');
const eContentDiv = document.getElementById('content');
const eListDiv = document.getElementById('list');
const twicePerSecond = limitRate(500);


function isValidGithubCommitDiffUrl(url){
    return !!url.match(/^https:\/\/github.com\/.+\/commit\/.+.diff$/);
}

function setInputClassByValidity(eInput, isValid){
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

function changeUrl(inputElement){
    const url = inputElement.value.replace(/(.diff)?$/, ".diff");
    if(!setInputClassByValidity(inputElement, isValidGithubCommitDiffUrl(url))) return;

    twicePerSecond(() => {
        history.replaceState({},"","?url="+url);
        loadPageViaProxyServer(url, "https://crossorigin.me")
            .then(parse)
            .then(formatChunks)
            .then(data=>{
                fileListView(eListDiv, data);
                mainView(eContentDiv, data);
            })
    });
}

function loadPageViaProxyServer(url, proxyUrl){
    return fetch(proxyUrl + '/' + url)
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

