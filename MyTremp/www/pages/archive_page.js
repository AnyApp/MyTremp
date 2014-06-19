/**
 Creates the categories page content.
 */
var archive_page;

archive_page = {
    loadPage: function (cat_id) {
        var archivePageContents =
            viewsFactory.header({page_content_class: 'page_content articles_page_main_content', content_scroll_id: 'articles_page_main_content' + cat_id, backButton: true, title_id: 'articles_page_title_id' + cat_id}) +
                viewsFactory.footer({id: 'archive_footer'});
        var initFunction = (function () {

            // api address
            var netivotiAPI = "http://www.netivoti.co.il/wp-content/Application/get_data.php?archive_id=" + cat_id;
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                // debug : console.log("log: in news - status"+ xmlhttp.status+" and readystate: "+xmlhttp.readyState);
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    //parse the response to json
                    var jsonAfterParse = JSON.parse(xmlhttp.responseText);
                    //document.getElementById('articles_page_title_id' + cat_id).innerHTML = jsonAfterParse.name;
                    var bodyTextToAppend = '';
                    var articles = jsonAfterParse.articles;
                    for (var i = 0; i < articles.length; i++) {
                        console.log(i);
                        bodyTextToAppend += viewsFactory.article_row({
                            cssClasses: "article_wrap",
                            imgSrc: articles[i].logo,
                            imgClass: "cont_image",
                            titleClass: "articles_main_title",
                            mainTitle: articles[i].name,
                            descriptionClass: "main_article_description",
                            description: articles[i].excerpt,
                            onClick: "article_page.loadPage(" + articles[i].id + ");"
                        });
                    }

                    document.getElementById('articles_page_main_content' + cat_id).innerHTML = bodyTextToAppend;
                    loadAdToStrip('archive_footer');
                    touchScroll('articles_page_main_content');
                    cPages.get('main').vars.isMenuPage = 0;
                }
            }
            // open the connection using get method and send it
            xmlhttp.open("GET", netivotiAPI, true);
            xmlhttp.send();
        });
        cPages.addPage("cur_archive_page" + cat_id, archivePageContents, initFunction, touchScroll('articles_page_main_content'));
        cPages.moveToPage(app.container, "cur_archive_page" + cat_id, cPages.directions.left);
    }
};
