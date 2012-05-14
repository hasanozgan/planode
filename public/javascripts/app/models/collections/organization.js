// Filename: views/home/main
define([
    'underscore',
    'backbone',
    'app/models/organization'
], function($, _, Backbone, OrganizationModel) {

    var OrganizationCollection = Backbone.Collection.extend({

        model: OrganizationModel,

        initialize: function() {

        }

    });

    return new OrganizationCollection;
});
