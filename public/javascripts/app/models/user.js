// Filename: views/home/main
define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var UserModel = Backbone.Model.extend({

        defaults: {
            fullname: null,
            email: null,
            role: "member"
        },

        url: function() {
            return "/auth/signup";
        },

        initialize: function() {
        }
    });

    return UserModel;
});
