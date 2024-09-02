var box = document.getElementById("box");
var startScreen = document.getElementById("startScreen");

var lastUpdate = Date.now();
var myInterval = setInterval(tick, 0);
var dt = 0;

function tick() {
    let now = Date.now();
    dt = now - lastUpdate;
    lastUpdate = now;
}

//window.addEventListener('load', function () {
//    box.style.animationName = 'scaleAnimation';
//    startScreen.style.animationName = 'opacityAnimation';
//    setTimeout(function (){
//        box.style.animationName = 'none';
//        startScreen.style.display = 'none';
//    }, 2000);
//});

function GoTo(elementName) {
    const offset = document.getElementById("menu-content").getBoundingClientRect().height;
    var y = document.getElementById(elementName).getBoundingClientRect().top - offset + window.pageYOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
}

var DescriptionDropDown = document.getElementsByClassName("DropDown");

function InitDropDown() {
    for (var i = 0; i < DescriptionDropDown.length; i++) {
        DescriptionDropDown[i].parentElement.style.height = "70px";
        DescriptionDropDown[i].addEventListener("click", function (i) {
            if (this.innerHTML == "expand_more") {
                const descText = this.parentElement.childNodes[3];//why is it 3? ah well
                this.parentElement.style.height = (descText.offsetHeight + 32) + "px";
                this.innerHTML = "expand_less";
            }
            else {
                this.parentElement.style.height = '70px';
                this.innerHTML = "expand_more";
            }
        });
    }
}

InitDropDown();
