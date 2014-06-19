/**
 *  Page Manager is created to help create multi-paged applications in single html file.
 */
var cPages;
cPages = {
    /* the pages */
    pages: {},
    firstLoad: true,
    historyStack: new Array(),
    currentPage: "",
    directions: {right:"right",left:"left"},
    directions_css_classes: {
        right:{
            container_class:"slide_right",
            page_before_class:"page_before_slide_right"
        },
        left:{
            container_class:"slide_left",
            page_before_class:"page_before_slide_left"
        }
    },
    moveBackDirection: "right",

    /**
     * Add new page to the page manager.
     * @param pageName: the name of the page.
     * @param pageContent: the content of the page.
     */
    addPage: function(pageName,pageContent,initFunction,refreshFunction) {
        //Create new page.
        this.pages[pageName] = {
            page_id: "page_"+pageName,
            content:        "<div class='gpu_accelerated pages_manager_page' id='page_"+pageName+"'><div class='page_all_container'>"+pageContent+'</div></div>',
            vars:  {},
            refresh: refreshFunction,
            init: initFunction,
            showed: false
        }
    },

    /**
     * Remove page from the page manager.
     * @param pageName
     */
    removePage: function(pageName) {
        //Check if exist.
        if (pageName in this.pages) {
            var toDeletePage = document.getElementById(this.pages[pageName].page_id);
            //Add to container.
            if (toDeletePage) {
                toDeletePage.parentNode.removeChild(toDeletePage);
            }
            //Deletes content.
            delete this.pages[pageName];
        }
    },

    /**
     * Returns the page with pageName.
     * @param pageName
     * @returns {{content: *, vars: {}}|*}
     */
    get: function(pageName) {
        return this.pages[pageName];
    },

    insertPageToStack: function(toPage) {
        for (var i=this.historyStack.length-1; i>=0; i--) {
            if (this.historyStack[i] === toPage) {
                this.historyStack.splice(i, 1);
                // break;       //<-- Uncomment  if only the first term has to be removed
            }
        }
        this.historyStack.push(toPage);
    }
    ,
    /**
     * move to page.
     * @param container
     * @param toPage
     * @param direction
     */
    moveToPage: function(container,toPage,direction,onFinish) {
        if (toPage in this.pages) {
            if (cPages.isContainerLocked(container)) {
                return;
            }
            cPages.lockContainer(container);

            //Push to stack history.
            this.insertPageToStack(toPage);

            var lastPage = cPages.currentPage;
            var lastPageDiv = null;
            if (lastPage!="") {
                lastPageDiv = document.getElementById(cPages.pages[lastPage].page_id);
            }

            //Quick show and return.
            if (this.firstLoad || !lastPageDiv) {
                container.innerHTML = this.pages[toPage].content;
                this.firstLoad = false;
                cPages.currentPage = toPage;
                cPages.unlockContainer(container);
                return;
            }
            //Replace current page.
            cPages.currentPage = toPage;


            // Default direction
            if (!direction in this.directions || direction== undefined) {
                direction = this.directions.right;
            }

            //container.style.position = "relative";

            var toPageDiv = document.getElementById('page_'+toPage);
            //Add to container.
            if (!toPageDiv) {
                container.innerHTML += this.pages[toPage].content;
                toPageDiv = document.getElementById('page_'+toPage);
            }

            toPageDiv.style.display = "inline-block";
            lastPageDiv = document.getElementById(cPages.pages[lastPage].page_id);
            lastPageDiv.style.zIndex = "4";
            toPageDiv.style.zIndex = "2";

            //Move to the side.
            toPageDiv.className = toPageDiv.className + " "+cPages.directions_css_classes[direction].page_before_class;
            //toPageDiv.clientHeight; //Force layout refresh. IMPORTANT!!!
            //lastPageDiv.clientHeight; //Force layout refresh. IMPORTANT!!!
            app.container.offsetWidth;

            //Unbind all transition callbacks.
            $("#"+toPageDiv.id).unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
            $("#"+lastPageDiv.id).unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
            //Bind transition end callback.
            $("#"+lastPageDiv.id).bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
                //alert(lastPageDiv.id);
                //alert(toPageDiv.id);
                //alert(toPageDiv.id);
                toPageDiv.className =  toPageDiv.className.replace(cPages.directions_css_classes[direction].page_before_class,"");
                lastPageDiv.className =  lastPageDiv.className.replace(cPages.directions_css_classes[direction].container_class,"");
                //container.innerHTML = cPages.pages[toPage].content;
                for (var page in cPages.pages) {
                    //alert(toPage);
                    //alert(page);
                    //alert(toPage);
                    var currentPage = document.getElementById(cPages.pages[page].page_id);
                    if (currentPage) {
                        for (var direction_class in cPages.directions_css_classes) {
                            //alert(cPages.directions_css_classes[direction_class].container_class);
                            //alert("Page: "+currentPage.id+" Class: "+cPages.directions_css_classes[direction_class].container_class);
                            //document.getElementById(cPages.pages[page].page_id).className.replace(cPages.directions_css_classes[direction_class].container_class,"");
                            //document.getElementById(cPages.pages[page].page_id).className.replace(cPages.directions_css_classes[direction_class].page_before_class,"");
                            document.getElementById(cPages.pages[page].page_id).className = "gpu_accelerated pages_manager_page";

                            //alert("Page: "+currentPage.id+" Class: "+currentPage.className);
                        }
                        if (page != toPage){
                            currentPage.style.display = "none";
                        }
                    }
                }
                if (onFinish) {
                    onFinish();
                }
                if(cPages.pages[toPage].init && !cPages.pages[toPage].showed){
                    cPages.pages[toPage].showed = true;
                    cPages.pages[toPage].init();
                }
                else if (cPages.pages[toPage].refresh) {
                    cPages.pages[toPage].refresh();
                }
                cPages.unlockContainer(container);
            });
            //Start Transition.
            //alert(lastPageDiv.id);
            lastPageDiv.className = lastPageDiv.className+ " "+this.directions_css_classes[direction].container_class;
            //alert(lastPageDiv.className);
            //container.clientHeight; //Force layout refresh. IMPORTANT!!!
            //toPageDiv.clientHeight; //Force layout refresh. IMPORTANT!!!
            //lastPageDiv.clientHeight; //Force layout refresh. IMPORTANT!!!
            //toPageDiv.clientHeight; //Force layout refresh. IMPORTANT!!!


        }
        else {
            console.error("moveToPage Error: page "+toPage+" doesn't exist.");
        }
    },

    moveBack: function(container) {
        if (cPages.isContainerLocked(container)) {
            return;
        }
        //Remove last page from the history.
        var toDelete = this.historyStack.pop();
        var page = this.historyStack.pop();
        this.moveToPage(container,page,this.moveBackDirection,function() {cPages.removePage(toDelete);});
    },
    globalMoveBack: function() {
        var container = app.container;
        if (cPages.isContainerLocked(container)) {
            return;
        }
        //Remove last page from the history.
        var toDelete = this.historyStack.pop();
        var page = this.historyStack.pop();
        this.moveToPage(container,page,this.moveBackDirection,function() {cPages.removePage(toDelete);});
    },
    lockContainer: function(container) {
        container.pagesManageIsLocked = true;
    },

    unlockContainer: function(container) {
        container.pagesManageIsLocked = false;
    },

    isContainerLocked: function(container) {
        return container.pagesManageIsLocked;
    }
}

document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is loaded and it is now safe to make calls PhoneGap methods
//
function onDeviceReady() {
    // Register the event listener
    document.addEventListener("backbutton", cPages.globalMoveBack, true);
}


