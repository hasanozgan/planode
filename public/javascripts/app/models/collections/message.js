// Filename: views/home/main
define([
    'underscore',
    'backbone',
    'app/models/message'
], function($, _, Backbone, MessageModel) {

    var MessageCollection = Backbone.Collection.extend({

        model: MessageModel,

        initialize: function() {

        }

    });

    return new MessageCollection;
});
