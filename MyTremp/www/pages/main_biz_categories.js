/**
 * Created by tallevi on 23/02/14.
 */
var main_biz_categories = {
    loadPage: function() {
        var biz_cat_page_contents =
            viewsFactory.header({page_content_class: 'page_content biz_cat_page',content_scroll_id:'biz_cat_page_main_content', backButton:true, title_id: 'biz_cat_page_title_id'})+
                viewsFactory.footer({id:"main_biz_footer"});
        var biz_cats_initial_function = (function() {

            // api address
            var netivotiAPI = "http://www.netivoti.co.il/wp-content/Application/get_data.php?is_biz_cat_page=1";
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange=function()
            {
                // debug : console.log("log: in news - status"+ xmlhttp.status+" and readystate: "+xmlhttp.readyState);
                if (xmlhttp.readyState==4 && xmlhttp.status==200)
                {
                    //parse the response to json
                    var jsonAfterParse = JSON.parse(xmlhttp.responseText);
                    console.log(jsonAfterParse.name);
                    //document.getElementById('biz_cat_page_title_id').innerHTML = "עסקים";
                    var bodyTextToAppend='';
                    var businesses = jsonAfterParse.businesses;
                    for (var i=0;i<businesses.length;i++)
                    {
                        bodyTextToAppend+=viewsFactory.biz_cat_row({
                            cssClasses: "biz_cat_wrap",
                            imgClass: "cont_image",
                            imgSrc: businesses[i].cat_pic[0],
                            titleClass: "articles_main_title",
                            mainTitle: businesses[i].cat_name,
                            descriptionClass: "main_article_description",
                            onClick:  "biz_subcategories.loadPage("+businesses[i].cat_id+");"
                        });
                    }

                    document.getElementById('biz_cat_page_main_content').clientHeight;
                    document.getElementById('biz_cat_page_main_content').innerHTML = bodyTextToAppend;
                    loadAdToStrip('main_biz_footer');
                    touchScroll('biz_cat_page_main_content');
                    cPages.get('main').vars.isMenuPage = 0;
                    refreshLinks();
                }
            }
            // open the connection using get method and send it
            xmlhttp.open("GET",netivotiAPI,true);
            xmlhttp.send();


        });



        cPages.addPage("biz_categories_page",biz_cat_page_contents,biz_cats_initial_function);
        cPages.moveToPage(app.container,"biz_categories_page",cPages.directions.left);
    }
}
