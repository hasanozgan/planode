// Filename: views/home/main
define([
    'jquery',
    'underscore',
    'backbone',

    'app/views/common/sidebar',

    'bootstrap',
    'fullcalendar'

], function($, _, Backbone, SideBarView) {

    var LocationPanel = Backbone.View.extend(
    {
        el: $("#page"),

        organization_id: 0,

        events: {
            "click .add-location": "addLocation"
        },

        addLocation: function() {

            if ($("#location_name").val().length == 0) {
                return false;
            }

            $(".location-list").prepend("<li>"+
                "<div class='organization-item'>"+$("#location_name").val()+"</div>"+
                "<div class='organization-actions'><a href='#remove-action' class='remove'><i class='icon-remove'></i> Sil</a></div>"+
                "</li>");

            $("#location_name").val("");
            $("#location_name").focus();

            $(".location-list > li").mouseover(function() {
                $(this).find(".organization-item").addClass("active");
                $(this).find(".organization-actions").addClass("active");
            });

            $(".location-list > li").mouseout(function() {
                $(this).find(".organization-item").removeClass("active");
                $(this).find(".organization-actions").removeClass("active");
            });

            return false;
        },

        render: function(pOrganizationId) {

            this.organization_id = parseInt(pOrganizationId);

            require(['text!app/views/organization/location.html'], function(LocationPanelTemplate) {

                var compiledTemplate = _.template( LocationPanelTemplate, {} );

                $("#location").empty();
                $("#location").html(compiledTemplate);

            });
        }

    });

    return new LocationPanel;
});
