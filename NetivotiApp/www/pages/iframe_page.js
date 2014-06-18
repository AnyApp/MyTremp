/**
 * Created by tallevi on 11/02/14.
 */
var iframe_page = {
    loadPage: function(link) {
        var iframe_page_content =
            viewsFactory.header({page_content_class: 'iframe_page_content',content_scroll_id:'iframe_page_main_content', backButton:true, title_id: 'iframe_page_title_id'})+
                '<div id="gallery_second_title"></div>'+
                '<div class="line_sep"></div>'+
                '<div style="position:absolute; left: 0; right: 0; bottom: 50px; top: 60px; ">'+
                '<iframe width="100%" height="100%" target="_top" frameborder="0" src="'+link+'"> </iframe>'+
                '</div>'+
                viewsFactory.footer({id:"single_iframe_footer"});
        var initial_function = (function()
        {
            //document.getElementById('single_image_page_title_id').innerHTML = name;
            loadAdToStrip('single_iframe_footer');
            touchScroll('iframe_page_main_content');
            cPages.get('main').vars.isMenuPage = 0;
            refreshLinks();
        });

        cPages.addPage("single_iframe_page",iframe_page_content);
        cPages.moveToPage(app.container,"single_iframe_page",cPages.directions.left, initial_function);
    }
}
