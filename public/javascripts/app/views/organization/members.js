// Filename: views/home/main
define([
    'jquery',
    'underscore',
    'backbone',

    'app/views/common/sidebar',

    'bootstrap',
    'fullcalendar'

], function($, _, Backbone, SideBarView) {

    var MemberPanel = Backbone.View.extend(
    {
        el: $("#page"),

        organization_id: 0,

        render: function(pOrganizationId) {

            this.organization_id = parseInt(pOrganizationId);

            require(['text!app/views/organization/members.html'], function(MemberPanelTemplate) {

                var compiledTemplate = _.template( MemberPanelTemplate, {} );

                $("#member").empty();
                $("#member").html(compiledTemplate);
            });
        }

    });

    return new MemberPanel;
});
