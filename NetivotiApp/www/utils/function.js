/**
 * Created by tallevi on 27/02/14.
 */

function PhoneGapMessage (message, title) {
    if (navigator.notification) {
        navigator.notification.alert(message, null, title, 'OK');
    } else {
        alert(title ? (title + ": " + message) : message);
    }
}

function getCatNameByID(cat_id, divID)
{
    var netivotiAPI = "http://www.netivoti.co.il/wp-content/Application/get_data.php?get_cat_name_by_id="+cat_id;
    var xmlhttp = new XMLHttpRequest();
    var ans = "";
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            //parse the response to json
            var jsonAfterParse = JSON.parse(xmlhttp.responseText);
            document.getElementById(divID).innerHTML = jsonAfterParse;
        }
    }

    // open the connection using get method and send it
    xmlhttp.open("GET",netivotiAPI,true);
    xmlhttp.send();
}

function isAndroid()
{
    var ua = navigator.userAgent;
    if( ua.indexOf("Android") >= 0 )
    {
        return true;
    }
    return false;
}

/**
 * Function that gets the div of the ad strip
 * and get random ad from the server
 * then place the ad in the strip
 */

function crappyDevice()
{
    var ua = navigator.userAgent;
    if( ua.indexOf("Android") >= 0 )
    {
        var androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8));
        if (androidversion <= 2.3)
        {
            return true;
        }
    }
    return false;
}

function isTouchDevice()
{
    try
    {
        document.createEvent("TouchEvent");
        return true;
    }
    catch(e)
    {
        return false;
    }
}

function touchScroll(id){
    if(isTouchDevice() && crappyDevice())
    { //if touch events exist and there is a scroll promblem - only android under 2.3
        var el=document.getElementById(id);
        var scrollStartPos=0;

        document.getElementById(id).addEventListener("touchstart", function(event) {
            scrollStartPos=this.scrollTop+event.touches[0].pageY;
            event.preventDefault();
        },false);

        document.getElementById(id).addEventListener("touchmove", function(event) {
            this.scrollTop=scrollStartPos-event.touches[0].pageY;
            event.preventDefault();
        },false);
    }
}


function loadAdToStrip(divID)
{
    var page_ad = document.getElementById(divID);
    //page_ad.style.backgroundImage.
    // api address
    var netivotiAPI = "http://www.netivoti.co.il/wp-content/Application/get_data.php?get_ads=1";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            var jsonAfterParse = JSON.parse(xmlhttp.responseText);
            page_ad.style.backgroundImage = ' url("'+jsonAfterParse.ad+'")';
            page_ad.style.backgroundRepeat = "no-repeat";
            page_ad.style.backgroundSize = "100% 100%";
        }
    }
    // open the connection using get method and send it
    xmlhttp.open("GET",netivotiAPI,true);
    xmlhttp.send();
}

function loadMainAD(divID)
{
    var page_ad = document.getElementById(divID);
    //page_ad.style.backgroundImage.
    // api address
    var netivotiAPI = "http://www.netivoti.co.il/wp-content/Application/get_data.php?get_big_ads=1";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            var jsonAfterParse = JSON.parse(xmlhttp.responseText);
            page_ad.style.display = "block";
            page_ad.style.backgroundImage = ' url("'+jsonAfterParse.ad+'")';
            page_ad.style.backgroundSize = "100% 100%";
            page_ad.style.backgroundRepeat = "no-repeat";
//            setTimeout(function(){
//                page_ad.style.display = "none";
//                    document.getElementById('menu_button_click_id').click();
//                setTimeout(function(){
//                document.getElementById('menu_button_click_id').click();
//                },100);
//            },4000);
        }
    }
    // open the connection using get method and send it
    xmlhttp.open("GET",netivotiAPI,true);
    xmlhttp.send();
}

function close_ad() {
    var page_ad = document.getElementById('main_ad_netivoti_id');
    page_ad.style.display = "none";
}

function refreshLinks() {
    $(function(){
        $('a').each(function() {
            $(this).attr('onclick', 'iframe_page.loadPage(\'' + this.href + '\')' );
            $(this).attr('href', '#' );
            $(this).attr('target', '_self');
        });
    });
}

