// Filename: views/home/main
define([
    'jquery',
    'underscore',
    'backbone',

    'app/views/common/sidebar',

    'bootstrap',
    'fullcalendar'

], function($, _, Backbone, SideBarView) {

    var WidgetPanel = Backbone.View.extend( {
        el: $("#page"),

        organization_id: 0,

        render: function(pOrganizationId) {

            this.organization_id = parseInt(pOrganizationId);

            require(['text!app/views/organization/widget.html'], function(WidgetPanelTemplate) {

                var compiledTemplate = _.template( WidgetPanelTemplate, {} );

                $("#widget").empty();
                $("#widget").html(compiledTemplate);
            });
        }

    });

    return new WidgetPanel;
});
