function setTheme(dark)
{
    var el;
    if(dark)
    {
        for (el of document.querySelectorAll(".light")) 
            el.className = el.className.replace("light", "dark");
        for (el of document.querySelectorAll(".light-text")) 
            el.className = el.className.replace("light-text", "dark-text");
    }
    else
    {
        for (el of document.querySelectorAll(".dark")) 
            el.className = el.className.replace("dark", "light");
        for (el of document.querySelectorAll(".dark-text")) 
            el.className = el.className.replace("dark-text", "light-text");
    }
}