function showHideSubMenu(id)
{
    if(document.getElementById(id).style.display=="block")
    {
        document.getElementById(id).style.display="none";
    }
    else
    {
        document.getElementById(id).style.display="block";
    }
}

function href(link)
{
    iframe_page.loadPage(link);
    //document.location.href = link;
}

function goToMainPage()
{
    if (cPages.get("main").vars.isMenuPage != 1)
    {
        cPages.moveToPage(app.container, "main", cPages.directions.left);
    }
}
/***
 Slide Side Menu.
 **/
var side_menu = {
    content: null,
    state: 'hidden',
    whiteSpaceTouch: function() {
        side_menu.showOrHide();
    },
    create: function() {
        this.content =
            '<div id="side_menu_container" class="side_menu_hidden">'+
            '<div class="menu_button" onclick="side_menu.showOrHide(function(){ goToMainPage(); });">ראשי</div>'+
            '<div id="side_menu_business_button" class="menu_button" onclick="side_menu.showOrHide(function(){main_biz_categories.loadPage(); cPages.get(\'main\').vars.isMenuPage = 0; });">עסקים</div>'+
            '<div id="side_menu_direct_contact_button" class="menu_button" onclick="side_menu.showOrHide(function(){direct_contact_page.loadPage(); cPages.get(\'main\').vars.isMenuPage = 0; });">קשר ישיר</div>'+
                '<div id="side_menu_direct_contact_button" class="menu_button" onclick="side_menu.showOrHide(function(){links_page.loadPage(); cPages.get(\'main\').vars.isMenuPage = 0; });">תשלומים</div>'+
            '<div id="side_menu_app_content" class="menu_button" onclick="side_menu.showOrHide(function(){app_content_page.loadPage();})">תוכן האפליקציה</div>'+
            '<div id="side_menu_app_content_sub_menu" class="menu_hidden_container">'+
                '<div class="menu_sub_button" onclick="side_menu.showOrHide(function(){archive_page.loadPage(2); cPages.get(\'main\').vars.isMenuPage = 0; });">חדשות</div>'+
                '<div class="menu_sub_button" onclick="side_menu.showOrHide(function(){archive_page.loadPage(3); cPages.get(\'main\').vars.isMenuPage = 0; });">המגזין</div>'+
                '<div class="menu_sub_button" onclick="side_menu.showOrHide(function(){galleries_archive_page.loadPage(9); cPages.get(\'main\').vars.isMenuPage = 0; });">גלריות</div>'+
                '<div class="menu_sub_button" onclick="side_menu.showOrHide(function(){archive_page.loadPage(190); cPages.get(\'main\').vars.isMenuPage = 0; });">מה קורה בעיר</div>'+
            '</div>'+
            '<div id="side_menu_app_content" class="menu_button" onclick="showHideSubMenu(\'side_menu_contact_sub_menu\')">צור קשר / פרסם כאן</div>'+
            '<div id="side_menu_contact_sub_menu" class="menu_hidden_container">'+
                '<div class="menu_sub_button side_menu_contact_links" id="call_now_button" onclick="href(\'tel:+0536222833\')">חייג עכשיו</div>'+
                '<div class="menu_sub_button side_menu_contact_links" id="send_mail_button" onclick="href(\'mailto:NETIVOTP@GMAIL.COM\')">שלח מייל</div>'+
//                '<div class="menu_sub_button side_menu_contact_links" id="facebook_button" onclick="side_menu.showOrHide(function(){iframe_page.loadPage(\'http://www.facebook.com/netivotp\'); });">face</div>'+
            '</div>'+
            '</div>'+
            '<div id="side_menu_whitespace" style="display:none;" class="side_menu_visible" ontouchstart="side_menu.whiteSpaceTouch();">'+
            +
            '</div>'
        ;
        app.container.innerHTML+=(this.content);

    },

    showOrHide: function(onFinish) {
        if (this.state == 'onHide') {
            return;
        }

        if (!this.content) {
            this.create();
            app.container.clientHeight;
        }
        // unbind ontransition end.
        $("#side_menu_container").unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");

        if (this.state == 'hidden') {
            document.getElementById('side_menu_container').style.display="";
            document.getElementById('side_menu_container').clientHeight;
            document.getElementById('side_menu_container').className = document.getElementById('side_menu_container').className.replace('side_menu_hidden','side_menu_visible');
            document.getElementById('side_menu_whitespace').style.display="";
            document.getElementById('side_menu_whitespace').style.width = window.innerWidth-45+"px";
            document.getElementById('side_menu_whitespace').style.marginRight="90px";
            this.state = 'visible';
            app.container.clientHeight;
        }
        else if (this.state == 'visible'){
            document.getElementById('side_menu_container').className = document.getElementById('side_menu_container').className.replace('side_menu_visible','side_menu_hidden');
            $("#side_menu_container").bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
                document.getElementById('side_menu_container').style.display="none";
                document.getElementById('side_menu_whitespace').style.display="none";
                side_menu.state = 'hidden';
                if (onFinish) {
                    onFinish();
                }
            });
            this.state = 'onHide';
            if (cPages.pages[cPages.currentPage] && cPages.pages[cPages.currentPage].refresh) {
                cPages.pages[cPages.currentPage].refresh();
            }
        }

    }

}