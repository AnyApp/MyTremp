/**
 Creates the categories page content.
 */
var single_image_page = {
    loadPage: function(img_src, name) {
        var single_image_page_content =
            viewsFactory.header({page_content_class: 'gallery_page_content',content_scroll_id:'gallery_page_main_content', backButton:true, title_id: 'single_image_page_title_id'})+
                '<div id="gallery_second_title">'+name+'</div>'+
                '<div class="line_sep"></div>'+
                '<img class="full_image" src="'+img_src+'"/>'+
                viewsFactory.footer({id:"single_image_footer"});
        var initial_function = (function()
        {
            //document.getElementById('single_image_page_title_id').innerHTML = name;
            loadAdToStrip('single_image_footer');
            touchScroll('gallery_page_main_content');
            cPages.get('main').vars.isMenuPage = 0;
            refreshLinks();
        });

        cPages.addPage("single_image_page",single_image_page_content);
        cPages.moveToPage(app.container,"single_image_page",cPages.directions.left, initial_function);
    }
}
