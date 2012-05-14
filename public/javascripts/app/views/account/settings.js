 // Filename: views/home/main
define([
    'jquery',
    'underscore',
    'backbone',

    'bootstrap'
], function($, _, Backbone) {

    var SettingsPage = Backbone.View.extend({

        render: function() {
            require(['text!app/views/account/settings.html'], function(SettingsTemplate) {

                var data = { _: _};
                var compiledTemplate = _.template( SettingsTemplate, data );

                $(compiledTemplate).modal();

            });
        }
    });

    return new SettingsPage ;
});
