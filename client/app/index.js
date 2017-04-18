'use strict';

import 'babel-polyfill';
import 'resources/style.less';
import 'resources/index.html';
import config from 'config';
import props from 'resources/props';
import withDelay from 'libraries/with-delay';
import parse from 'parse-diff';

const eUrlInput = document.getElementById('url');
const eContentDiv = document.getElementById('content');
const handleUrlChange = withDelay(500);

function parseDiff(diff){
    var files = parse(diff);
    const eFiles = document.createElement("ul");
    
    files
        .forEach(file => {
            const eFile = document.createElement("li");
            const eArticle = document.createElement("article");
            eFile.appendChild(eArticle);
            
            const eHeader = document.createElement("header");
            eArticle.appendChild(eHeader);

            const eH1 = document.createElement("h1");
            eH1.innerHTML = file.from + " -> " + file.to
            eHeader.appendChild(eH1);

            const eContent = document.createElement("div");
            eContent.className = "content"
            eArticle.appendChild(eContent);
            
            const eChunks = document.createElement("ul");
            eContent.appendChild(eChunks);

            file.chunks.forEach(chunk => {
                const eChunk = document.createElement("li");
                eChunks.appendChild(eChunk);
                
                const eCode = document.createElement("code");
                eChunk.appendChild(eCode)
                 
                chunk.changes.forEach(change => {
                    const eLine = document.createElement("span");
                    eLine.className = change.type;
                    eLine.innerHTML = change.content+"\n"
                    eCode.appendChild(eLine)
                });
            });
            
            eFiles.appendChild(eFile);
        });
    
    return eFiles;
}

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

function changeUrl(inputElement){
    const url = inputElement.value.replace(/(.diff)?$/, ".diff");
    if(!setInputValidity(inputElement, isValidGithubCommitDiffUrl(url))) return;
    
    handleUrlChange(() => 
        loadPageViaProxyServer(url, config.serverRoot+"/load")
            .then(content=>parseDiff(content))
            .then(diff=>{
                eContentDiv.innerHTML = "";
                eContentDiv.appendChild(diff);
            })
            .catch(err=>console.error(err)));
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