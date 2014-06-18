/**
 * Created by tallevi on 09/03/14.
 */

var app_content_page = {
    loadPage: function() {
        var app_content_page_contents =
            viewsFactory.header({page_content_class: 'page_content app_content_page',content_scroll_id:'app_content_main_content', backButton:true, title_id: 'app_content_page_title_id'})+
                viewsFactory.footer({id:"app_content_footer"});


        var app_content_initial_function = (function()
        {
            var newPageConent=viewsFactory.direct_contact_cat({
                cssClasses: "direct_contact_wrap",
                imgClass: "cont_image",
                contentClass: "biz_subcat_content_container",
                titleClass: "articles_main_title",
                mainTitle: "תוכן האפליקציה",
                descriptionClass: "main_article_description"
            });
            newPageConent+=viewsFactory.direct_contact_cat({
                cssClasses: "direct_contact_links_wrap",
                onClick: "archive_page.loadPage(2);",
                imgClass: "cont_image",
                contentClass: "biz_subcat_content_container",
                titleClass: "articles_main_title",
                mainTitle: "חדשות",
                descriptionClass: "main_article_description"
            });
            newPageConent+=viewsFactory.direct_contact_cat({
                cssClasses: "direct_contact_links_wrap",
                onClick:"archive_page.loadPage(3);",
                imgClass: "cont_image",
                contentClass: "biz_subcat_content_container",
                titleClass: "articles_main_title",
                mainTitle: "המגזין",
                descriptionClass: "main_article_description"
            });
            newPageConent+=viewsFactory.direct_contact_cat({
                cssClasses: "direct_contact_links_wrap",
                onClick:"galleries_archive_page.loadPage(9);",
                imgClass: "cont_image",
                contentClass: "biz_subcat_content_container",
                titleClass: "articles_main_title",
                mainTitle: "גלריות",
                descriptionClass: "main_article_description"
            });
            newPageConent+=viewsFactory.direct_contact_cat({
                cssClasses: "direct_contact_links_wrap",
                onClick:"archive_page.loadPage(190);",
                imgClass: "cont_image",
                contentClass: "biz_subcat_content_container",
                titleClass: "articles_main_title",
                mainTitle: "מה קורה בעיר",
                descriptionClass: "main_article_description"
            });
            document.getElementById('app_content_main_content').innerHTML = newPageConent;
            loadAdToStrip('app_content_footer');
            touchScroll('app_content_main_content');
            cPages.get('main').vars.isMenuPage = 0;
        });
        cPages.addPage("app_content_page",app_content_page_contents,app_content_initial_function, function() { touchScroll('app_content_main_content'); refreshLinks(); });
        cPages.moveToPage(app.container,"app_content_page",cPages.directions.left);
    }
}

