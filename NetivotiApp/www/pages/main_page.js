/**
 Creates the main page content.
 */

var mainPageContent =
    /*
        Header - netivot online
     */
    viewsFactory.header({content_scroll_id:'main_page_content_scroller', isWithAdd:true} )+
    '<div id="main_page_content"></div>'+
    viewsFactory.footer({id:'main_footer'});


/*
    ------------------------ Html injection functions --------------------------
    -- get data from netivoti server through json , parse it and inject it to --
    -- the html. TODO - arrange the struction and design those functions.     --
    ----------------------------------------------------------------------------
 */

/*
    =============================== news injection =============================
     Anonymous function to inject the news records into them curresponding div
     TODO - find a proper design to this function
    ============================================================================
 */
(function() {
    // api address
    var netivotiAPI = "http://www.netivoti.co.il/wp-content/Application/get_main_page_data.php";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            var cats_divs = {0:'',1:'',2:'',3:'', 4:'',5:''};
            var zeroOrOne=0;
            cats_divs[5]+="<div id='galleries_row_scroller' class='galleries_row_wrap'><div style='width: 330px; margin: 0 auto;'>";
            var index = 0;
            //parse the response to json
            var categories_data = JSON.parse(xmlhttp.responseText);
            for (var key in categories_data) {
                var category_data = categories_data[key];
                for (var post_key in category_data) {
                    var post = category_data[post_key];

                    if (index!=3) {
                        // whats up in town
                        // gallery row, article view
                        if(index==5)
                        {
                            cats_divs[index]+=
                                viewsFactory.gallery_row({
                                    cssClasses: "galleries_wrap",
                                    imgSrc: post.logo,
                                    more_info: post.more_info,
                                    imgClass: "cont_image",
                                    titleClass: "articles_main_title",
                                    mainTitle: post.name,
                                    onClick:  "article_page.loadPage("+post.id+");"
                                });
                        }
                        // ads
                        else if(index==4)
                        {
                            cats_divs[zeroOrOne]+=
                                viewsFactory.article_row({
                                    cssClasses: "ads_wrap",
                                    imgSrc: post.logo,
                                    imgClass: "cont_image",
                                    titleClass: "articles_main_title",
                                    mainTitle: post.name,
                                    descriptionClass: "main_article_description",
                                    description: post.excerpt,
                                    more_info: post.more_info,
                                    onClick:  "article_page.loadPage("+post.id+");"
                                });
                            zeroOrOne=((zeroOrOne+1)%2);
                        }
                        else if(index == 2)
                        {
                            cats_divs[index]+=
                                viewsFactory.article_row({
                                    cssClasses: "article_wrap",
                                    imgSrc: post.logo,
                                    imgClass: "cont_image",
                                    titleClass: "articles_main_title",
                                    mainTitle: post.name,
                                    descriptionClass: "main_article_description",
                                    description: post.excerpt,
                                    more_info: post.more_info,
                                    onClick:  "gallery_page.loadPage("+post.id+");"
                                });
                        }
                        else
                        {
                            cats_divs[index]+=
                                viewsFactory.article_row({
                                    cssClasses: "article_wrap",
                                    imgSrc: post.logo,
                                    imgClass: "cont_image",
                                    titleClass: "articles_main_title",
                                    mainTitle: post.name,
                                    descriptionClass: "main_article_description",
                                    description: post.excerpt,
                                    more_info: post.more_info,
                                    moreCSS: post.moreCSS,
                                    onClick:  "article_page.loadPage("+post.id+");"
                                });
                        }
                    }
                    else {
                        cats_divs[index]+=
                            viewsFactory.sliderRow({
                                imgLink: post.logo,
                                imgDesc: post.name,
                                onClick:  "article_page.loadPage("+post.id+");"
                            });
                    }
                }
                index++;
            }
            cats_divs[5]+="</div></div>";
            //Add the data to the view.
            var main_data =
                '<div class="main_slider_top_container"><div class="swiper-container" id="netivoti_main_slider">'+
                    '<div id="netivoti_main_slider_content" class="swiper-wrapper">'+cats_divs[3]+' </div>'+
                '</div><div class="pagination"></div></div>'+
                '<div id="news_row" class="news_title_class title_bar_back" onclick="archive_page.loadPage(2);">חדשות</div>'+cats_divs[0]+
                '<div id="magazine_row" class="news_title_class title_bar_back" onclick="archive_page.loadPage(3);">המגזין</div>'+cats_divs[1]+
                '<div id="gal_row" class="news_title_class title_bar_back" onclick="galleries_archive_page.loadPage(9);">גלריות</div>'+cats_divs[2]+
                '<div class="netivoti_line"></div>'+
                '<div id="galleries_row" class="news_title_class title_bar_back" onclick="archive_page.loadPage(190);" >מה קורה בעיר</div>'+cats_divs[5];

            document.getElementById('main_page_content').innerHTML = main_data;
            app.container.clientHeight;
            var sliderContent = document.getElementById("netivoti_main_slider_content");
            var slider = document.getElementById('netivoti_main_slider');
            loadMainAD('main_ad_netivoti_id');
            loadAdToStrip('main_footer');
            if (sliderContent && slider) {
                //alert(slider.id);
                sliderContent.innerHTML = cats_divs[3];
                sliderContent.clientHeight;
                //Save the data
                cPages.get("main").vars.sliderData = cats_divs[3];
                //var bullets = document.getElementById('position').getElementsByTagName('li');
                cPages.get("main").vars.mySwiper = new Swiper('#netivoti_main_slider',{
                    loop:true,
                    speed : 500,
                    autoplay: 3000,
                    pagination: '.pagination',
                    paginationClickable: true,
                    autoplayDisableOnInteraction: false
                });
            }
            app.container.clientHeight;

            touchScroll('main_page_content_scroller');
            refreshLinks();


            /*cPages.get("main").vars.mainScroll = new IScroll('#main_page_content_scroller',{
                bounce:false,
                scrollbars: true
            });
            cPages.get("main").vars.galleriesScroll = new IScroll('#galleries_row_scroller',{
                bounce:false,
                scrollX:true
            });*/


        }
    }
    // open the connection using get method and send it
    xmlhttp.open("GET",netivotiAPI,true);
    xmlhttp.send();
})();


var mainRefreshFunction = function() {
    cPages.get("main").vars.isMenuPage = 1;
    var slider = document.getElementById('netivoti_main_slider');
    var sliderContent = document.getElementById("netivoti_main_slider_content");

    if (slider && sliderContent) {
        if (cPages.get("main").vars.sliderData) {
            sliderContent.innerHTML = cPages.get("main").vars.sliderData;
        }
        else {
            sliderContent.innerHTML = "";
        }
        cPages.get("main").vars.mySwiper = new Swiper('#netivoti_main_slider',{
            loop:true,
            speed : 1000,
            autoplay: 3000,
            pagination: '.pagination',
            paginationClickable: true,
            autoplayDisableOnInteraction: false

        });
        touchScroll('main_page_content_scroller');
        /*cPages.get("main").vars.mainScroll = new IScroll('#main_page_content_scroller',{
            bounce:false,
            scrollbars: true
        });
        cPages.get("main").vars.galleriesScroll = new IScroll('#galleries_row_scroller',{
            bounce:false,
            scrollX:true
        });*/
    }

}
cPages.addPage("main",mainPageContent,null,mainRefreshFunction);
