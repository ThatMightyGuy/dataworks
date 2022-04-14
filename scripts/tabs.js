
var tabConts = [];

function populate()
{
    tabConts = document.getElementsByClassName("tabs-cont");
}
populate();
if(tabConts.length == 0)
{
    throw new Error("No tabs found");
}

function searchForId(arr, id)
{
    for(var i = 0; i < arr.length; i++)
    {
        if(arr[i].id == id)
        {
            return i;
        }
    }
    return null;
}

function switchTab(sender, tabNum)
{
    var id = sender.id.split("-").slice(0, 3).join("-");
    var tabCont = tabConts[searchForId(tabConts, id)];
    var tabs = tabCont.getElementsByClassName("tab");
    if(tabs[tabNum].classList.contains("tab-current"))
        return;
    for(var tab of tabs)
        if(tab.classList.contains("tab-current"))
            tab.classList.remove("tab-current");
    tabs[tabNum].classList.add("tab-current");
}