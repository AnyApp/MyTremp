/**
 * Views manipulations.
 * Created by dvircn on 25/01/14.
 */
var viewsFactory;
var doT;

viewsFactory = {
    /**
     *
     */
    title: doT.template("<h1 id='{{=it.id || \"\" }}' class='{{=it.cssClasses || \"\" }}' style='{{=it.inlineStyle || \"\" }}'>{{=it.title || \"\" }}</h1>"),

    button: doT.template("<div id='{{=it.id || \"\" }}' class='{{=it.cssClasses || \"\" }}' style='{{=it.inlineStyle || \"\" }}' onclick='({{=it.onClick || \"function(){}\" }})();'>{{=it.text || \"\" }}</div>"),

    centeredDiv: doT.template("<div style=\"text-align: center;\">{{=it.content || \"\" }}</div> "),

    div: doT.template("<div class='{{=it.cssClasses || \"\" }}' id='{{=it.divId || \"\" }}' >{{=it.content || \"\" }}</div> "),

    article_row: doT.template("<div onclick='{{=it.onClick || \"\" }}' class='{{=it.cssClasses || \"\" }}' style='background-image:url(\"{{=it.imgSrc || \"\" }}\"), url(img/left-arrow2.png);'><div class='article_content_container'> <div class='{{=it.titleClass || \"\" }}'>{{=it.mainTitle || \"\" }}</div> <div class='{{=it.descriptionClass || \"\" }}'>{{=it.description || \"\" }}</div> <div class=\"articles_more_info {{=it.moreCSS}}\">{{=it.more_info || \"\" }}</div> </div></div> "),

    biz_cat_row: doT.template("<div onclick='{{=it.onClick || \"\" }}' class='{{=it.cssClasses || \"\" }}' style='background-image:url(\"{{=it.imgSrc || \"\" }}\")'><div class='{{=it.contentClass || \"biz_cat_content_container\" }}'> <div class='{{=it.titleClass || \"\" }}'>{{=it.mainTitle || \"\" }}</div></div></div> "),

    biz_subcat_row: doT.template("<div onclick='{{=it.onClick || \"\" }}' class='{{=it.cssClasses || \"\" }}'><div class='{{=it.contentClass || \"biz_cat_content_container\" }}'> <div class='{{=it.titleClass || \"\" }}'>{{=it.mainTitle || \"\" }}</div></div></div> "),

    direct_contact_cat: doT.template("<div class='{{=it.cssClasses || \"\" }}' onclick='{{=it.onClick || \"\" }}'><div class='{{=it.contentClass || \"biz_cat_content_container\" }}'> <div class='{{=it.titleClass || \"\" }}'>{{=it.mainTitle || \"\" }}</div></div></div> "),

    biz_row : doT.template("<div onclick=\"showHideSubMenu('biz_row_{{=it.id}}')\" class='{{=it.cssClasses || \"\" }}' style='background-image:url(\"{{=it.imgSrc || \"\" }}\")'><div class='biz_cat_content_container'> <div class='{{=it.titleClass || \"\" }}'>{{=it.mainTitle || \"\" }}</div></div></div> <div id=\"biz_row_{{=it.id}}\" class=\"biz_hidden_container\">{{? it.phone}} <div class=\"menu_sub_button side_menu_contact_links\" id=\"call_now_button\" onclick=\"href('tel:{{=it.phone}}')\"> חייג עכשיו - {{=it.phone}}</div> {{?}} {{? it.mail}}  <div class=\"menu_sub_button side_menu_contact_links\" id=\"send_mail_button\" onclick=\"href('mailto:{{=it.mail}}')\"> שלח מייל </div> {{?}} {{? it.address}} <div class=\"menu_sub_button side_menu_contact_links\" id=\"address_button\" onclick=\"href('http://maps.google.com/maps?q={{=it.address}}')\">{{?}} {{=it.address}} </div> {{? it.facebook }} <div class=\"menu_sub_button side_menu_contact_links\" id=\"facebook_button\" onclick=\"href('{{=it.facebook}}')\"> דף הפייסבוק שלנו </div> {{?}} {{? it.website }} <div class=\"menu_sub_button side_menu_contact_links\" id=\"website_button\" onclick=\"href('{{=it.website}}')\"> אתר האינטרנט שלנו </div> {{?}} {{? it.description }}  <div onclick=\"PhoneGapMessage('{{=it.description}}', 'אודות ושעות פתיחה');\" class=\"menu_sub_button side_menu_contact_links\" id=\"info_button\"> אודות ושעות פתיחה </div> {{?}}</div> "),

    gallery_row: doT.template("<div onclick='{{=it.onClick || \"\" }}' class='{{=it.cssClasses || \"\" }}' style='background-image:url(\"{{=it.imgSrc || \"\" }}\")'><div class='gallery_content_container'><div class='main_page_pink_desc'>{{=it.more_info}}</div> <div class='{{=it.titleClass || \"\" }}'>{{=it.mainTitle || \"\" }}</div> </div></div> "),

    sliderRow: doT.template("<div onclick='{{=it.onClick || \"\" }}' class='swiper-slide main_photo_slide' style='background: url(\"{{=it.imgLink || \"\" }}\");background-size: 100% auto;' > <!--<img class='responsive_image' src='{{=it.imgLink || \"\" }}'>--> <div class=\"mainSliderCaption\"><div class=\"mainSliderCaptionText\">{{=it.imgDesc || \"\" }}</div></div> </div> "),

    header: function(options) {
        var header_str = (options.isWithAdd ? '<div class="main_ad_netivoti" id="main_ad_netivoti_id"><img src="images/rem.png" class="imagead" onclick="close_ad()" /> </div>' : '') +'<div class="page_header">'+
            '<div class="nav_bar_background"><div class="main_menu_button" id="menu_button_click_id" onclick="side_menu.showOrHide();"></div><div class="top_title" id='+(options.title_id || "main_title")+'>'+(options.title || "" )+'</div></div>'+
            (options.backButton ?
                '<div class="back_button" onclick="cPages.moveBack(app.container)"></div>' : '') +
            '<div id="main_top_row_div"></div>'+
            '</div>'+
            '<div class="'+(options.page_content_class? options.page_content_class:'page_content')+'" id="'+(options.content_scroll_id? options.content_scroll_id:'')+'">';

        return header_str;
    },
    footer: doT.template('</div><div class="page_footer" id="{{=it.id || \"\" }}"></div>')

}
 
