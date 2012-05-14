// Filename: views/home/main
define([
    'jquery',
    'underscore',
    'backbone',

    'bootstrap',
    'fullcalendar'

], function($, _, Backbone, FooterTemplate, SettingsTemplate) {

    var FooterView = Backbone.View.extend({

        render: function() {

            require(['text!app/views/common/footer.html'], function(FooterTemplate) {
                //FooterTemplate + UserSettingsTemplate;
                var data = { _: _};
                var compiledTemplate = _.template(FooterTemplate, data );

                $("#footer").html(compiledTemplate);
            });
        }
    });

    return new FooterView;
});
