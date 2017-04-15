import "babel-polyfill";
import "resources/style.less";
import "resources/index.html";
import config from "config";
import props from "resources/props.json";

document.writeln('<h1>' + props.userName + '</h1>');

fetch(config.serverRoot+"/"+props.userName)
    .then(res=>res.json())
    .then(user=>'' +
        '<a href="mailto:' + user.email + '">' + user.email + '</a><br>' +
        '<p>' + user.status+ '</p>'
    )
    .then(html=>document.body.innerHTML+=html);