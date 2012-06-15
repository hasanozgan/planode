// Filename: views/home/main
define([
    'jquery',
    'underscore',
    'backbone',

    'text!app/views/account/login.html',

    'md5',
    'bootstrap'
], function($, _, Backbone, LoginTemplate) {

    var LoginPage = Backbone.View.extend({

        el: $("#page"),

        model: null,

        render: function() {

            $("#page").empty();
            $("#page").html(LoginTemplate);

            var LoginModel = Backbone.Model.extend({
                url: "/auth/login",

                rules: {
                    email: {
                        pattern: new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
                        source: "#frm-login input[name=email]",
                        message: "Eposta adresinizi kontrol ediniz"
                    },
                    password: {
                        pattern: new RegExp(/^(([\w|\d]{6,12})$)/i),
                        source: "#frm-login input[name=password]",
                        message: "Şifrenizi kontrol ediniz"
                    }
                },
                showMessage: function (alertType, message) {
                    $(".alert").removeClass("alert-error");
                    $(".alert").removeClass("alert-success");
                    $(".alert").removeClass("alert-info");
                    $(".alert").removeClass("alert-warning");

                    $(".alert").addClass("alert-"+alertType);
                    $(".alert-message").html(message);

                    $(".alert").show();
                },
                showFieldMessage: function (alertType, field, message) {

                    if (this.rules[field] != undefined) {

                        if (message == undefined) {
                            message = this.rules[field].message;
                        }

                        $(this.rules[field].source).closest(".control-group").addClass(alertType);
                        $(this.rules[field].source).siblings(".help-block").html(message);

                    }
                },

                hideFieldMessage: function (field) {
                    $(this.rules[field].source).closest(".control-group").removeClass("info");
                    $(this.rules[field].source).closest(".control-group").removeClass("success");
                    $(this.rules[field].source).closest(".control-group").removeClass("warning");
                    $(this.rules[field].source).closest(".control-group").removeClass("error");
                    $(this.rules[field].source).siblings(".help-block").html("");
                },

                isValid: function() {
                    var result = true;

                    // reset elements
                    this.hideFieldMessage("email");
                    this.hideFieldMessage("password");

                    // check elements
                    if (!this.rules.email.pattern.test($(this.rules.email.source).val())) {
                        result = false;
                        this.showFieldMessage("error", "email");
                    }

                    if (!this.rules.password.pattern.test($(this.rules.password.source).val())) {
                        result = false;
                        this.showFieldMessage("error", "password");
                    }

                    if (result) {
                        this.set({
                            email: $(this.rules.email.source).val(),
                            password: hex_md5($(this.rules.password.source).val())
                        });
                    }

                    return result;
                }
            });

            this.model = new LoginModel({});
        },

        events: {
            "submit #frm-login": "doLogin"
        },

        doLogin: function() {

            var model = this.model;
            var succeed = true;

            if (model.isValid()) {
                model.save(null, {
                    error: function(model, response) {
                        console.log(response);
                        messages = JSON.parse(response.responseText);
                        succeed = false;
                        for (key in messages) {
                            if (key == "__alert__") {
                                model.showMessage("error", messages[key]);
                            }
                            else {
                                model.showFieldMessage("error", key, messages[key]);
                            }
                        }
                    },
                    success: function (model, response) {
                        App.user = response.account;
                        App.organizations = response.organizations;
                        App.router.navigate("calendar", true);
                    }
                });
            }

            return false;
        }
    });

    return new LoginPage;
});
