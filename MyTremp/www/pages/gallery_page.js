/**
 * Created by tallevi on 11/02/14.
 */
var gallery_page = {
    loadPage: function(gallery_id) {
        var articlesPageContent =
            viewsFactory.header({page_content_class: 'gallery_page_content',content_scroll_id:'gallery_page_main_content', backButton:true, title_id: 'gallery_page_title_id'})+
                viewsFactory.footer({id:"galleries_footer"});
        (function() {
            // api address
            var netivotiAPI = "http://www.netivoti.co.il/wp-content/Application/get_data2.php?gallery_id="+gallery_id;
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange=function()
            {
                // debug : console.log("log: in news - status"+ xmlhttp.status+" and readystate: "+xmlhttp.readyState);
                if (xmlhttp.readyState==4 && xmlhttp.status==200)
                {
                    //parse the response to json
                    var jsonAfterParse = JSON.parse(xmlhttp.responseText);
                    //document.getElementById('gallery_page_title_id').innerHTML = jsonAfterParse.name;
                    var bodyTextToAppend='<div id="gallery_second_title">'+jsonAfterParse.name+'</div>'+
                        '<div class="line_sep"></div>'+
                        '<div class="main_gallery_content">';
                    var index;
                    for (index = 0; index < jsonAfterParse.images.length; ++index) {
                        var link = jsonAfterParse.images[index];
                        bodyTextToAppend+='<img class="gallery_image" src="'+jsonAfterParse.images[index].thumb+'" onclick="single_image_page.loadPage(\''+jsonAfterParse.images[index].original+'\' , \''+jsonAfterParse.name+'\');"/>';
                    }
                    bodyTextToAppend+='</div>';
                    document.getElementById('gallery_page_main_content').innerHTML = bodyTextToAppend;
                    loadAdToStrip('galleries_footer');
                    touchScroll('gallery_page_main_content');
                    cPages.get('main').vars.isMenuPage = 0;
                    refreshLinks();
                }
            }
            // open the connection using get method and send it
            xmlhttp.open("GET",netivotiAPI,true);
            xmlhttp.send();
        })();
        cPages.addPage("single_gallery_page",articlesPageContent,null, touchScroll('gallery_page_main_content'));
        cPages.moveToPage(app.container,"single_gallery_page",cPages.directions.left);
    }
}
