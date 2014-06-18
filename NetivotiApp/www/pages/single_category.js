/**
 * Created by tallevi on 23/02/14.
 */
var single_subcategory = {
    loadPage: function(cat_id) {
        var single_sub_category_page_contents =
            viewsFactory.header({page_content_class: 'page_content single_cat_page',content_scroll_id:'single_cat_page_main_content', backButton:true, title_id: 'single_cat_page_title_id'})+
                viewsFactory.footer({id:"single_cat_footer"});
        var single_category_initial_function = (function() {

            // api address
            var netivotiAPI = "http://www.netivoti.co.il/wp-content/Application/get_data.php?get_businneses="+cat_id;
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange=function()
            {
                // debug : console.log("log: in news - status"+ xmlhttp.status+" and readystate: "+xmlhttp.readyState);
                if (xmlhttp.readyState==4 && xmlhttp.status==200)
                {
                    //parse the response to json
                    var jsonAfterParse = JSON.parse(xmlhttp.responseText);
                    console.log(jsonAfterParse.name);
                    //getCatNameByID(cat_id, 'single_cat_page_title_id');
                    var bodyTextToAppend='';
                    var businesses = jsonAfterParse;
                    for (var i=0;i<businesses.length;i++)
                    {
                        bodyTextToAppend+=viewsFactory.biz_row({
                            cssClasses: "biz_cat_wrap",
                            imgClass: "cont_image",
                            imgSrc: businesses[i].logo,
                            id: businesses[i].id,
                            phone: businesses[i].phone,
                            mail: businesses[i].mail,
                            address: businesses[i].address,
                            facebook: businesses[i].facebook,
                            website: businesses[i].website,
                            description: businesses[i].description,
                            titleClass: "articles_main_title",
                            mainTitle: businesses[i].name,
                            descriptionClass: "main_article_description"
                        });
                    }

                    document.getElementById('single_cat_page_main_content').innerHTML = bodyTextToAppend;
                    loadAdToStrip('single_cat_footer');
                    touchScroll('single_cat_page_main_content');
                    cPages.get('main').vars.isMenuPage = 0;
                    refreshLinks();
                }
            }
            // open the connection using get method and send it
            xmlhttp.open("GET",netivotiAPI,true);
            xmlhttp.send();
        });
        cPages.addPage("single_category_page",single_sub_category_page_contents,single_category_initial_function);
        cPages.moveToPage(app.container,"single_category_page",cPages.directions.left);
    }
}
