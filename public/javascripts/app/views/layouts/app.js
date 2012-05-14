// Filename: views/home/main
define([
    'jquery',
    'underscore',
    'backbone',

    'app/views/common/navbar',
    'app/views/common/sidebar',
    'app/views/common/footer',

    'bootstrap',
    'fullcalendar'

], function($, _, Backbone, NavBarView, SideBarView, FooterView) {

    var AppLayout = Backbone.View.extend({

        render: function(PageView, options) {
            App.authorized({
                success: function() {
                    $("#page").removeClass("span12").addClass("span10");
                    SideBarView.render(true);
                    NavBarView.render();
                    FooterView.render();

                    PageView.render(options);
                }
            });
        }
    });

    return new AppLayout;
});
