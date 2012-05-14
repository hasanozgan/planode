// Filename: views/home/main
define([
    'jquery',
    'underscore',
    'backbone',

    'bootstrap',
    'fullcalendar'

], function($, _, Backbone) {

    var OrganizationPage = Backbone.View.extend( {
        el: $("#page"),

        render: function() {
            require(['text!app/views/organization/settings.html'], function(OrganizationTemplate) {
                $("#page").empty();
                $("#page").html(OrganizationTemplate);
            });
        }

    });

    return new OrganizationPage;
});
