// Filename: views/home/main
define([
    'jquery',
    'underscore',
    'backbone',
    'text!app/views/common/navbar.html',

    'bootstrap',
    'fullcalendar'

], function($, _, Backbone, NavBarTemplate) {

    var NavBarView = Backbone.View.extend({
        initialize: function() {
        },
        render: function() {

            var data = { _: _};
            var compiledTemplate = _.template(NavBarTemplate, data);

            $("#header").html(compiledTemplate);

            if (App.user == null) {
                $("#header .signed-in").hide();
                $("#header .public").show();
            }
            else {
                $("#header .signed-in").show();
                $("#header .public").hide();
            }
        }
    });

    return new NavBarView;
});
