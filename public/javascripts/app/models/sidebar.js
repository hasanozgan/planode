// Filename: views/home/main
define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var SidebarModel = Backbone.Model.extend({

        defaults: {
            messageCount: 0,
            organizationList : []
        },

        initialize: function() {
        }
    });

    return new SidebarModel;
});
