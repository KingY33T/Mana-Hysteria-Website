var dialog;
var artwork;

function selectdrawing(filename) {
  dialog = document.getElementById("dialog");
  artwork = document.getElementById(filename);
  dialog.style.display = "flex";
  artwork.style.display = "flex";
}

function closealldrawings() {
  dialog = document.getElementById("dialog");
  dialog.style.display = "none";
  
  let children = dialog.children;
  for (let i = 0; i < children.length; i++) {
    children[i].style.display = "none";
  }
}