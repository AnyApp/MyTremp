/**
 Creates the categories page content.
 */
var article_page = {
    loadPage: function(article_id) {
        var articlesPageContent =
            viewsFactory.header({page_content_class: 'articles_page_content',content_scroll_id:'article_page_main_content', backButton:true, title_id: 'articles_page_title_id'})+
                viewsFactory.footer({id:'article_footer'});
        var articlesInitFunction = (function() {
            // api address
            var netivotiAPI = "http://www.netivoti.co.il/wp-content/Application/get_data.php?article_post_id="+article_id;
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange=function()
            {
                // debug : console.log("log: in news - status"+ xmlhttp.status+" and readystate: "+xmlhttp.readyState);
                if (xmlhttp.readyState==4 && xmlhttp.status==200)
                {
                    //parse the response to json
                    var jsonAfterParse = JSON.parse(xmlhttp.responseText);

                    var bodyTextToAppend='<div class="article_title_top" id="article_second_title">'+jsonAfterParse.name+'</div>'+
                        '<div class="article_excerpt">'+jsonAfterParse.excerpt+'</div>'+
                        '<div class="article_date">פורסם בתאריך: '+jsonAfterParse.date+'</div>'+
                        '<div class="main_article_content"><img src="'+jsonAfterParse.logo+'" class="articles_img" />'+
                        '<div class="articles_inner_content">'+jsonAfterParse.content+'</div></div>';
                    document.getElementById('article_page_main_content').innerHTML = bodyTextToAppend;
                    //document.getElementById('articles_page_title_id').innerHTML = jsonAfterParse.name;
                    document.getElementById('articles_page_title_id').style.fontSize = "16px";
                    document.getElementById('article_page_main_content').clientHeight;
                    loadAdToStrip('article_footer');
                    touchScroll('article_page_main_content');
                    cPages.get('main').vars.isMenuPage = 0;
                    refreshLinks();
                }
            }

            // open the connection using get method and send it
            xmlhttp.open("GET",netivotiAPI,true);
            xmlhttp.send();

        });
        cPages.addPage("single_article_page",articlesPageContent,articlesInitFunction, function() { refreshLinks(); touchScroll('article_page_main_content'); });
        cPages.moveToPage(app.container,"single_article_page",cPages.directions.left);
    }
}
