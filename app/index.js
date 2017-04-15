import 'babel-polyfill';
import 'resources/style.less';
import 'resources/index.html';
import withDelay from 'libraries/with-delay'
import props from 'resources/props';


const eUrlInput = document.getElementById('url');
const eContentDiv = document.getElementById('content');
const handleUrlChange = withDelay(500);

function changeUrl(e){
    handleUrlChange(()=>{
        eContentDiv.innerHTML = e.target.value
    });
}

eUrlInput.addEventListener('keypress', changeUrl);
eUrlInput.addEventListener('paste', changeUrl);