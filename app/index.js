import "babel-polyfill";
import "resources/style.less";
import "resources/index.html";
import props from "resources/props.json";

document.write('<h1>Hello, ' + props.userName + '!</h1>');