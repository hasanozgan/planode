// Filename: views/home/main
define([
    'jquery',
    'underscore',
    'backbone',
    'text!app/views/home/main.html',

    'bootstrap',
    'fullcalendar'

], function($, _, Backbone, HomeTemplate) {

    var HomePage = Backbone.View.extend( {

        render: function() {
            $("#page").empty();
            $("#page").html(HomeTemplate);

        }

    });

    return new HomePage;
});
