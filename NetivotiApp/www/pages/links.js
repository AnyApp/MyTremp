/**
 * Created by tallevi on 08/03/14.
 */
/**
 * Created by tallevi on 02/03/14.
 */
/**
 * Created by tallevi on 23/02/14.
 */
var links_page = {
    loadPage: function() {
        var links_page_contents =
            viewsFactory.header({page_content_class: 'page_content links_page',content_scroll_id:'links_main_content', backButton:true, title_id: 'links_page_title_id'})+
                viewsFactory.footer({id:"links_footer"});
        var links_initial_function = (function() {

            // api address
            var netivotiAPI = "http://www.netivoti.co.il/wp-content/Application/get_data.php?links=1";
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange=function()
            {
                // debug : console.log("log: in news - status"+ xmlhttp.status+" and readystate: "+xmlhttp.readyState);
                if (xmlhttp.readyState==4 && xmlhttp.status==200)
                {
                    //parse the response to json
                    var jsonAfterParse = JSON.parse(xmlhttp.responseText);
                    var bodyTextToAppend='';

                    bodyTextToAppend+=viewsFactory.direct_contact_cat({
                        cssClasses: "direct_contact_wrap",
                        imgClass: "cont_image",
                        contentClass: "biz_subcat_content_container",
                        titleClass: "articles_main_title",
                        mainTitle: jsonAfterParse.cat_name,
                        descriptionClass: "main_article_description"
                    });
                    if(jsonAfterParse.links)
                    {
                        for(var j=0; j<jsonAfterParse.links.length ; j++)
                        {
                            bodyTextToAppend+=viewsFactory.direct_contact_cat({
                                cssClasses: "direct_contact_links_wrap",
                                onClick:"href(\""+jsonAfterParse.links[j].website+"\");",
                                imgClass: "cont_image",
                                contentClass: "biz_subcat_content_container",
                                titleClass: "articles_main_title",
                                mainTitle: jsonAfterParse.links[j].name,
                                descriptionClass: "main_article_description"
                            });
                        }
                    }



                    document.getElementById('links_main_content').innerHTML = bodyTextToAppend;

                    loadAdToStrip('links_footer');
                    touchScroll('links_main_content');
                    cPages.get('main').vars.isMenuPage = 0;
                    refreshLinks();
                }
            }
            // open the connection using get method and send it
            xmlhttp.open("GET",netivotiAPI,true);
            xmlhttp.send();
        });
        cPages.addPage("links_page",links_page_contents,links_initial_function);
        cPages.moveToPage(app.container,"links_page",cPages.directions.left);
    }
}

