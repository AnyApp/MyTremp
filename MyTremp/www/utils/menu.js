var menu;

menu = {
    create: function() {


        $(document).ready( function() {
            //Setup the ViewNavigator
            new SlidingView( 'sidebar', 'app_container' );
        } );

    }
}

menu.create();