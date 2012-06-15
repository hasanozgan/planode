// Filename: views/home/main
define([
    'jquery',
    'underscore',
    'backbone',

    'text!app/views/common/sidebar.html',

    'app/views/account/settings',
    'app/views/organization/add',

    'bootstrap',
    'fullcalendar'

], function($, _, Backbone, SideBarTemplate, AccountSettingsView, OrganizationAddView) {

    var SideBarView = Backbone.View.extend({

        el: $("#sidebar"),
        model: null,
        events: {
            "click #account-settings": "accountSettings",
            "click #organization-add": "organizationAdd"
        },

        accountSettings: function()
        {
            AccountSettingsView.render();

            return false;
        },

        organizationAdd: function()
        {
            OrganizationAddView.render();

            return false;
        },

        render: function(visible) {

            if (visible) {

                App.action = Backbone.history.getHash();

                var data = { "organizations" : App.organizations.sort(function(a, b) { return ((a.id > b.id) ? -1 : 1) }) };
                var compiledTemplate = _.template(SideBarTemplate, data);
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
