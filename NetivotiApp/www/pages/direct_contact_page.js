/**
 * Created by tallevi on 02/03/14.
 */
/**
 * Created by tallevi on 23/02/14.
 */
var direct_contact_page = {
    loadPage: function() {
        var direct_contact_page_contents =
            viewsFactory.header({page_content_class: 'page_content direct_contact_page',content_scroll_id:'direct_contact_page_main_content', backButton:true, title_id: 'direct_contact_page_title_id'})+
                viewsFactory.footer({id:"direct_contact_footer"});
        var direct_contact_initial_function = (function() {

            // api address
            var netivotiAPI = "http://www.netivoti.co.il/wp-content/Application/get_data.php?is_contact_page=1";
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange=function()
            {
                // debug : console.log("log: in news - status"+ xmlhttp.status+" and readystate: "+xmlhttp.readyState);
                if (xmlhttp.readyState==4 && xmlhttp.status==200)
                {
                    //parse the response to json
                    var jsonAfterParse = JSON.parse(xmlhttp.responseText);
                    console.log(jsonAfterParse.name);
                    var bodyTextToAppend='';
                    for(var i=0; i<jsonAfterParse.length ; i++)
                    {
                        bodyTextToAppend+=viewsFactory.direct_contact_cat({
                            cssClasses: "direct_contact_wrap",
                            imgClass: "cont_image",
                            contentClass: "biz_subcat_content_container",
                            titleClass: "articles_main_title",
                            mainTitle: jsonAfterParse[i].cat_name,
                            descriptionClass: "main_article_description"
                        });
                        if(jsonAfterParse[i].businesses)
                        {
                            for(var j=0; j<jsonAfterParse[i].businesses.length ; j++)
                            {
                                bodyTextToAppend+=viewsFactory.direct_contact_cat({
                                    cssClasses: "direct_contact_biz_wrap",
                                    onClick:"href(\"tel:"+jsonAfterParse[i].businesses[j].phone+"\");",
                                    imgClass: "cont_image",
                                    contentClass: "biz_subcat_content_container",
                                    titleClass: "articles_main_title",
                                    mainTitle: jsonAfterParse[i].businesses[j].name,
                                    descriptionClass: "main_article_description"
                                });
                            }
                        }
                    }

                    document.getElementById('direct_contact_page_main_content').innerHTML = bodyTextToAppend;

                    loadAdToStrip('direct_contact_footer');
                    touchScroll('direct_contact_page_main_content');
                    cPages.get('main').vars.isMenuPage = 0;
                    refreshLinks();
                }
            }
            // open the connection using get method and send it
            xmlhttp.open("GET",netivotiAPI,true);
            xmlhttp.send();
        });
        cPages.addPage("direct_contact_page",direct_contact_page_contents,direct_contact_initial_function,touchScroll('direct_contact_page_main_content'));
        cPages.moveToPage(app.container,"direct_contact_page",cPages.directions.left);
    }
}

