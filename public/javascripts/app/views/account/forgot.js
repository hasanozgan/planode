// Filename: views/home/main
define([
    'jquery',
    'underscore',
    'backbone',

    'text!app/views/account/forgot.html',

    'bootstrap'
], function($, _, Backbone, ForgotTemplate) {

    var ForgotPage = Backbone.View.extend({

        el: $("#page"),

        render: function() {

            $("#page").empty();
            $("#page").html(ForgotTemplate);

        }
    });

    return new ForgotPage ;
});
