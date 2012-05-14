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

    var MainLayout = Backbone.View.extend({

        render: function() {
            $("#page").removeClass("span10").addClass("span12");

            SideBarView.render(false);

            NavBarView.render();
            FooterView.render();

        }
    });

    return new MainLayout;
});
