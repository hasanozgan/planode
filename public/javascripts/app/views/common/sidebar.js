// Filename: views/home/main
define([
    'jquery',
    'underscore',
    'backbone',

    'text!app/views/common/sidebar.html',

    'app/views/account/settings',

    'bootstrap',
    'fullcalendar'

], function($, _, Backbone, SideBarTemplate, AccountSettingsView) {

    var SideBarView = Backbone.View.extend({

        el: $("#sidebar"),
        model: null,
        events: {
            "click #account-settings": "accountSettings"
        },

        accountSettings: function()
        {
            AccountSettingsView.render();
            return false;
        },

        render: function(visible) {

            if (visible) {

                App.action = Backbone.history.getHash();

                var data = { _: _};
                var compiledTemplate = _.template(SideBarTemplate, data );

                $("#sidebar").html(compiledTemplate);
                $(".nav-list > li").removeClass("active");
                $(".nav-list * i").removeClass("icon-white");
                $('a[href^="#'+App.action+'"] i').addClass("icon-white");
                $('a[href^="#'+App.action+'"]').parent().addClass("active");
                $("#sidebar").show();

            }
            else {
                $("#sidebar").hide();
            }
        }
    });

    return new SideBarView;
});
