'use strict';

import 'babel-polyfill';
import 'resources/style.less';
import 'resources/index.html';
import config from 'config';
import props from 'resources/props';
import withDelay from 'libraries/with-delay'

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

function changeUrl(e){
    const url = e.target.value.replace(/(.diff)?$/, ".diff");
    if(!setInputValidity(e.target, isValidGithubCommitDiffUrl(url))) return;
    
    handleUrlChange(() => 
        loadPageViaProxyServer(url, config.serverRoot+"/load")
            .then(html=>eContentDiv.innerHTML=html)
            .catch(err=>console.log(err)));
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

eUrlInput.addEventListener('input', changeUrl);
// eUrlInput.addEventListener('paste', changeUrl);