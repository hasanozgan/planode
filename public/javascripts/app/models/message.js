// Filename: views/home/main
define([
    'underscore',
    'backbone',
    'app/models/organization',

], function($, _, Backbone) {

    var MessageModel = Backbone.Model.extend({

        defaults: {
        },

        initialize: function() {
        }
    });

    return new MessageModel;
});
