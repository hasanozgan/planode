// Filename: views/home/main
define([
    'jquery',
    'underscore',
    'backbone',

    'text!app/views/account/signup.html',

    'app/models/user',

    'bootstrap'
], function($, _, Backbone, SignUpTemplate, UserModel) {

    var SignUpPage = Backbone.View.extend({

        el: $("#page"),

        render: function() {

            $("#page").empty();
            $("#page").html(SignUpTemplate);

            var SignUpModel = Backbone.Model.extend({
                url: "/auth/signup",

                rules: {
                    fullname: {
                        pattern: new RegExp(/^(.+)$/i),
                        source: "#frm-signup input[name=fullname]",
                        error: function () {
                            $(this.source).closest(".control-group").addClass('error');
                            $(this.source).siblings(".help-block").html("Lütfen, adınızı ve soyadınızı giriniz.");
                        }
                    },
                    email: {
                        pattern: new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i),
                        source: "#frm-signup input[name=email]",
                        error: function () {
                            $(this.source).closest(".control-group").addClass('error');
                            $(this.source).siblings(".help-block").html("Lütfen, eposta adresinizi kontrol ediniz");
                        }
                    },
                    password: {
                        pattern: new RegExp(/^(([\w|\d]{6,12})$)/i),
                        source: "#frm-signup input[name=password]",
                        error: function () {
                            $(this.source).closest(".control-group").addClass('error');
                            $(this.source).siblings(".help-block").html("Lütfen, şifrenizi kontrol ediniz");
                        }
                    },
                    password_confirmation: {
                        pattern: new RegExp(/^(([\w|\d]{6,12})$)/i),
                        source: "#frm-signup input[name=password_confirmation]",
                        error: function () {
                            $(this.source).closest(".control-group").addClass('error');
                            $(this.source).siblings(".help-block").html("Şifreniz doğrulanamıyor, lütfen kontrol ediniz.");
                        }
                    }
                },

                isValid: function() {
                    var result = true;

                    // reset elements
                    $(this.rules.fullname.source).closest(".control-group").removeClass("error");
                    $(this.rules.email.source).closest(".control-group").removeClass("error");
                    $(this.rules.password.source).closest(".control-group").removeClass("error");
                    $(this.rules.password_confirmation.source).closest(".control-group").removeClass("error");
                    $(this.rules.fullname.source).siblings(".help-block").html("");
                    $(this.rules.email.source).siblings(".help-block").html("");
                    $(this.rules.password.source).siblings(".help-block").html("");
                    $(this.rules.password_confirmation.source).siblings(".help-block").html("");

                    // check elements
                    if ($(this.rules.fullname.source).val().length == 0) {
                        result = false;
                        this.rules.fullname.error();
                    }
                    if (!this.rules.email.pattern.test($(this.rules.email.source).val())) {
                        result = false;
                        this.rules.email.error();
                    }
                    if (!this.rules.password.pattern.test($(this.rules.password.source).val())) {
                        result = false;
                        this.rules.password.error();
                    }
                    if ($(this.rules.password.source).val() != $(this.rules.password_confirmation.source).val()) {
                        result = false;
                        this.rules.password_confirmation.error();
                    }

                    if (result) {
                        this.set({
                            fullname: $(this.rules.fullname.source).val(),
                            email: $(this.rules.email.source).val(),
                            password: hex_md5($(this.rules.password.source).val())
                        });
                    }

                    return result;
                }
            });

            this.model = new SignUpModel({});

        },

        events: {
            "submit #frm-signup": "doSignup"
        },

        doSignup: function() {
            var succeed = true;

            if (this.model.isValid()) {
                this.model.save(null, {
                    error: function(model, response) {
                        succeed = false;

                    },
                    success: function (model, response) {

                        App.user = "user";
                        App.router.navigate("calendar", true);
                    }
                });
            }

            return false;
        }
    });

    return new SignUpPage;
});
