// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',

  'app/views/layouts/main',
  'app/views/layouts/app',
  'app/views/home/main',
  'app/views/account/login',
  'app/views/account/signup',
  'app/views/account/forgot',
  'app/views/organization/settings',
  'app/views/account/calendar'
//  'app/views/home/main',
  //'app/views/organization/category'
], function($, _, Backbone, MainLayout, AppLayout, HomePage, LoginPage, SignUpPage, ForgotPage, OrganizationPage, CalendarPage){
    var AppRouter = Backbone.Router.extend({

        routes: {
            // Define some URL routes

            'home': 'homeAction',
            'signup': 'signupAction',
            'login': 'loginAction',
            'logout': 'logoutAction',
            'forgot': 'forgotAction',

            'calendar': 'calendarAction',
            'organization/:id': 'organizationAction',

            // Default
            '*actions': 'defaultAction'
        },

        initialize: function() {

            App = {
                router: this,

                getOrganization: function (o_id) {

                    for (var index in this.organizations) {
                        if (this.organizations[index] != undefined && this.organizations[index].id == o_id) {
                            return this.organizations[index];
                        }
                    }
                },

                editOrganization: function (obj) {

                    this.deleteOrganization(obj.id);
                    this.addOrganization(obj);

                },

                deleteOrganization: function (o_id) {

                    this.organizations = $.grep(this.organizations, function(value) {
                        return value.id != o_id;
                    });

                },

                addOrganization: function (obj) {
                    if (this.organizations == undefined) {
                        this.organizations = [];
                    }

                    var found = false;
                    for (var index in this.organizations) {

                        if (this.organizations[index].id == obj.id) {
                            found = true;
                        }
                    }

                    if (found == false) {
                        this.organizations.push(obj);
                    }
                },
                authorized: function (options) {
                    if (App.user == undefined) {
                        $.ajax({
                            url: '/auth/check',
                            type: 'POST',
                            success: function(data) {
                                App.user = data.account;
                                App.organizations = data.organizations;
                                options.success.call();
                            },
                            error: function(data) {
                                if (options.error == undefined) {
                                    App.router.navigate("login", true);
                                }
                                else {
                                    options.error.call();
                                }

                            }
                        });
                    }
                    else {
                        options.success.call();
                    }
                }
            };
        },

        // Actions
        homeAction: function() {
            MainLayout.render();
            HomePage.render();
        },
        loginAction: function() {
            MainLayout.render();
            LoginPage.render();
        },
        logoutAction: function() {
            $.ajax({
                url:'/auth/logout',
                type:'POST',
                success: function() {
                    App.user = null;
                    App.router.navigate("login", true);
                }
            });
        },
        signupAction: function() {
            MainLayout.render();
            SignUpPage.render();
        },

        forgotAction: function() {
            MainLayout.render();
            ForgotPage.render();
        },

        calendarAction: function() {
            AppLayout.render(CalendarPage);
        },

        organizationAction: function(id) {
            AppLayout.render(OrganizationPage, id);
        },

        defaultAction: function(actions) {
            App.authorized({
                success: function() {
                    App.router.navigate("calendar", true);
                },
                error: function() {
                    App.router.navigate("home", true);
                }
            });
        }
    });

    var initialize = function(){
        var appRouter = new AppRouter();
        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});
