// Filename: views/home/main
define([
    'jquery',
    'underscore',
    'backbone',

    'app/views/event/datepair',

    'spin'


], function($, _, Backbone, DatePairView) {

    var CreateEventView = Backbone.View.extend({

        render: function() {

            require(['text!app/views/event/create.html'], function(CreateEventTemplate) {
                var data = { _: _};
                var compiledTemplate = _.template( CreateEventTemplate, data );

                $(compiledTemplate).modal();
                DatePairView.render();
                $("#limit").spin();
            });

        }
    });

    return new CreateEventView;
});
