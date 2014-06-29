var pager =
{
    onPhoneEdit: false,
    pages: {},
    addPage:
        function(id,menuId,contentId)
        {
            this.pages[id] =
            {
                contentId:contentId,
                menuId:menuId
            }
        },
    moveToPage:
        function(id)
        {
            if (pager.onPhoneEdit)
            {
                return;
            }

            for (var pageId in this.pages)
            {
                document.getElementById(this.pages[pageId].menuId).className='tabbed_menu_element';
                document.getElementById(this.pages[pageId].contentId).className='page_content hidden';
            }
            // Move to page.
            document.getElementById(this.pages[id].contentId).className='page_content';
            document.getElementById(this.pages[id].menuId).className='tabbed_menu_element tabbed_menu_element_chosen';
            refreshScrolling();
        }
}