var modal, span;

function showModal(id)
{
    modal = document.getElementById(id);
    modal.style.display = "block";
    span = modal.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}