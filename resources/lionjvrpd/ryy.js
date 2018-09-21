var pathname = window. location.pathname; console. log(pathname);
var myLink = document.getElementsByTagName("a");
 
function elt(name, attrs, ...children) {
let dom = document.createElement(name);
for (let attr of Object.keys(attrs)) {
dom.setAttribute(attr, attrs[attr]);
}
for (let child of children) {
if (typeof child != "string") dom.appendChild(child);
else dom.appendChild(document.createTextNode(child));
}
return dom;
}

for(let link of myLink){if (link.pathname == pathname){
    link.style.borderBottom= "2px solid rgb(216, 92, 20)";
    console.log(link.pathname)}
    else if(link.pathname == '/none.html')link.addEventListener("click",event=> event.preventDefault());

}
let err1 = elt("span",{id: "err1"},"Invalid mail");
let err2 = elt("span",{id:  "err1"},"incorrect password");

function checkIn(inp){
if (inp.value.search == 0){document.body.appendChild(err1);

}
else {console.log("okay");}
}

document.getElementById("redirect").addEventListener("click",event=>{
    if(confirm("redirect to buganow.com ?"))return true;
    else  event.preventDefault();
})
