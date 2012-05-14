// Filename: views/home/main
define([
    'jquery',
    'underscore',
    'backbone',

    'app/views/event/datepair',

    'bootstrap',
    'spin'
], function($, _, Backbone, DatePairView) {

    var EditEventView = Backbone.View.extend({

        render: function() {

            require(['text!app/views/event/edit.html'], function(EditEventTemplate) {

                var data = { _: _};
                var compiledTemplate = _.template( EditEventTemplate, data );

                $(compiledTemplate).modal();
                DatePairView.render();
                $("#limit").spin();
            });

        }
    });

    return new EditEventView;
});
