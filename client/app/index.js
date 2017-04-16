import 'babel-polyfill';
import 'resources/style.less';
import 'resources/index.html';
import config from 'config';
import props from 'resources/props';
import withDelay from 'libraries/with-delay'

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


document.writeln('<h1>' + props.userName + '</h1>');

fetch(config.serverRoot+"/"+props.userName)
    .then(res=>res.json())
    .then(user=>'' +
        '<a href="mailto:' + user.email + '">' + user.email + '</a><br>' +
        '<p>' + user.status+ '</p>'
    )
    .then(html=>document.body.innerHTML+=html);
