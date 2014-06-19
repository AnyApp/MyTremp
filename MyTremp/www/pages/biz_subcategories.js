/**
 * Created by tallevi on 23/02/14.
 */
var biz_subcategories = {
    loadPage: function(cat_id) {
        var biz_subcat_page_contents =
            viewsFactory.header({page_content_class: 'page_content biz_cat_page',content_scroll_id:'biz_subcat_page_main_content', backButton:true, title_id: 'biz_subcat_page_title_id'})+
                viewsFactory.footer({id:"biz_subcat_footer"});
        var biz_subcats_initial_function = (function() {

            // api address
            var netivotiAPI = "http://www.netivoti.co.il/wp-content/Application/get_data.php?get_subcategories="+cat_id;
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange=function()
            {
                // debug : console.log("log: in news - status"+ xmlhttp.status+" and readystate: "+xmlhttp.readyState);
                if (xmlhttp.readyState==4 && xmlhttp.status==200)
                {
                    //parse the response to json
                    var jsonAfterParse = JSON.parse(xmlhttp.responseText);
                    console.log(jsonAfterParse.name);
                    //getCatNameByID(cat_id, 'biz_subcat_page_title_id');
                    var bodyTextToAppend='';
                    var businesses = jsonAfterParse.businesses;
                    for (var i=0;i<businesses.length;i++)
                    {
                        bodyTextToAppend+=viewsFactory.biz_subcat_row({
                            cssClasses: "biz_subcat_wrap",
                            imgClass: "cont_image",
                            contentClass: "biz_subcat_content_container",
                            titleClass: "articles_main_title",
                            mainTitle: businesses[i].cat_name + ' ('+businesses[i].bizNum+') ',
                            descriptionClass: "main_article_description",
                            onClick:  "single_subcategory.loadPage("+businesses[i].cat_id+");"
                        });
                    }

                    document.getElementById('biz_subcat_page_main_content').innerHTML = bodyTextToAppend;
                    loadAdToStrip('biz_subcat_footer');
                    touchScroll('biz_subcat_page_main_content');
                    cPages.get('main').vars.isMenuPage = 0;
                    refreshLinks();
                }
            }
            // open the connection using get method and send it
            xmlhttp.open("GET",netivotiAPI,true);
            xmlhttp.send();
        });
        cPages.addPage("biz_sub_categories_page",biz_subcat_page_contents,biz_subcats_initial_function, touchScroll('biz_subcat_page_main_content'));
        cPages.moveToPage(app.container,"biz_sub_categories_page",cPages.directions.left);
    }
}
