// Filename: views/home/main
define([
    'jquery',
    'underscore',
    'backbone',

    'app/views/common/sidebar',
    'app/views/organization/settings',
    'app/views/organization/category',
    'app/views/organization/location',
    'app/views/organization/members',
    'app/views/organization/widget'


], function($, _, Backbone, SideBarView, SettingsPanel, CategoryPanel, LocationPanel, MemberPanel, WidgetPanel) {

    var OrganizationPanel = Backbone.View.extend( {
        el: $("#page"),

        organization_id: 0,

        panelChange: function(panel) {
            if (panel == "#settings") {
                SettingsPanel.render(this.organization_id);
            }
            else if (panel == "#category") {
                CategoryPanel.render(this.organization_id);
            }
            else if (panel == "#location") {
                LocationPanel.render(this.organization_id);
            }
            else if (panel == "#member") {
                MemberPanel.render(this.organization_id);
            }
            else if (panel == "#widget") {
                WidgetPanel.render(this.organization_id);
            }
        },

        render: function(organization_id) {

            var base = this;
            this.organization_id = parseInt(organization_id);

            if (!App.getOrganization(this.organization_id)) {
                App.router.navigate("calendar", true);
                return;
            }

            require(['text!app/views/organization/panel.html', 'cookie'], function(OrganizationTemplate) {

                var compiledTemplate = _.template( OrganizationTemplate, { "organization_name": App.getOrganization(organization_id).name } );

                $("#page").empty();
                $("#page").html(compiledTemplate);


                if ($.cookie('panel') == undefined) {
                    $.cookie('panel', "#settings", { expires: 365, path: "/" });
                }

                var panel = $.cookie('panel');
                base.panelChange(panel);
                $('#organization-settings a[href='+panel+']').tab("show");

                $('a[data-toggle="tab"]').on('shown', function (e) {
                    var panel = $(e.target).attr("href");
                    $.cookie('panel', panel, { expires: 365, path: "/" });
                    base.panelChange(panel);
                })
            });
        }

    });

    return new OrganizationPanel;
});
