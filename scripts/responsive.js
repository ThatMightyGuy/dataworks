/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function menuResponsive() {
    var x = document.getElementById("header");
    if (x.className === "flex-horizontal header") {
        x.className += " responsive";
    } else {
        x.className = "flex-horizontal header";
    }
}