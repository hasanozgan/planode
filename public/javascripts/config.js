require.config({
    paths: {
        jquery: 'lib/jquery-1.7.1.min',
        jquery_ui: 'lib/jquery-ui-1.8.14.min',
        bootstrap: 'lib/bootstrap-2.0.2.min',
        underscore: 'lib/underscore-1.3.2.min',
        backbone: 'lib/backbone-0.9.2.min',
        text: 'lib/require-text-1.0.8.min',
        fullcalendar: 'lib/fullcalendar-1.5.3',
        timepicker: 'lib/jquery.timepicker',
        spin: 'lib/jquery.spin-1.0.2',
        cookie: 'lib/jquery.cookie',
        md5: 'lib/md5',
//        datepicker: 'lib/bootstrap-datepicker',

        qtip: 'lib/jquery.qtip-1.0.0-rc3.min',
        templates: '../templates'
    }
});

require([

  // Load our app module and pass it to our definition function
  'app/init'

  // Some plugins have to be loaded in order due to their non AMD compliance
  // Because these scripts are not "modules" they do not pass any values to the definition function below
], function(App){
  // The "app" dependency is passed in as "App"
  // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
  App.initialize();
});
