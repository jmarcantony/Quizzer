var i = 0;
var txt = 'A fun and simple quiz platform...';
var speed = 50; 

function typeWriter() {
  if (i < txt.length) {
    document.getElementById("intro").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}

typeWriter();
