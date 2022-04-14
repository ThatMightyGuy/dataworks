/* options */
var slideshowContainers = [
    ["tv-slideshow", true]
]; // [[slide id, autoscroll], ...]
var autoscroll_delay = 5000; // ms
var useCaching = true; // uncheck if the container DOM is constantly changing
var autostart = true;


var slideshowContainerElements = [];
for(var _slideshow of slideshowContainers){
    slideshowContainerElements.push(document.getElementById(_slideshow[0]));
}

var slideshowImages = []
if(useCaching)
{
    for(var _slideshowContainer of slideshowContainerElements){
        slideshowImages.push(_slideshowContainer.getElementsByClassName("slideshow-image"));
    }
}

function domToContainerId(element)
{
    console.log(element);
    for(var i = 0; i < slideshowContainerElements.length; i++)
        if(slideshowContainerElements[i] == element)
            return i;
    return null;
}

function advance(slideshowId, dir = 1)
{
    if(dir > 1 || dir < -1 || dir == 0) return null;
    var ssElem = slideshowContainerElements[slideshowId];
    var ssImages = [];
    if(useCaching)
        ssImages = slideshowImages[slideshowId];
    else
        ssImages = ssElem.getElementsByClassName("slideshow-image");
    var nodes = Array.prototype.slice.call(ssElem.getElementsByClassName("slideshow-image"));
    var currentImage = nodes.indexOf(ssElem.getElementsByClassName("slideshow-image-current")[0]);
    ssImages[currentImage].classList.remove("slideshow-image-current");
    if(dir > 0)
    {
        if(currentImage == ssImages.length - 1)
            ssImages[0].classList.add("slideshow-image-current");
        else
            ssImages[currentImage + 1].classList.add("slideshow-image-current");
    }
    else if(dir < 0)
    {
        if(currentImage == 0)
            ssImages[ssImages.length - 1].classList.add("slideshow-image-current");
        else
            ssImages[currentImage - 1].classList.add("slideshow-image-current");
    }
    return currentImage + dir;
}

function update()
{
    for(var i = 0; i < slideshowContainerElements.length; i++)
        if(slideshowContainers[i][1])
            advance(i);
}

var intervalId;
function start()
{
    intervalId = setInterval(update, autoscroll_delay);
}
function pause()
{
    if(intervalId)
        clearInterval(intervalId);
    else return null;
}
if(autostart)
    onload = start;
