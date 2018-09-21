

let app = document.getElementById("app");

app.addEventListener("click",event=>{event.preventDefault();
    app.appendChild(elt("select", {id:"applications", name:"applist"},
elt("option",{value:"Notepad"},"Notepad"),elt("option",{value:  "Pixel"},"Pixel App")));



})
console.log(app);