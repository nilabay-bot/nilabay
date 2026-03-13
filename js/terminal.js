function typeWriter(element, speed = 15){

let text = element.textContent;
element.textContent = "";

let i = 0;

function typing(){

if(i < text.length){

element.textContent += text.charAt(i);
i++;

setTimeout(typing, speed);

}

}

typing();

}

window.onload = function(){

let blocks = document.querySelectorAll(".type");

blocks.forEach(function(block){
typeWriter(block);
});

};
