var dialog;
var artwork;
var inner;

function selectdrawing(filename) {
  dialog = document.getElementById("dialog");
  artwork = document.getElementById(filename);
  inner = document.getElementById("inner");
  dialog.style.display = "flex";
  artwork.style.display = "block";
  inner.style.display = "block";
}

function closealldrawings() {
  inner = document.getElementById("inner");
  dialog = document.getElementById("dialog");
  dialog.style.display = "none";
  inner.style.display = "none";
  
  let children = inner.children;
  for (let i = 0; i < children.length; i++) {
    children[i].style.display = "none";
  }
}