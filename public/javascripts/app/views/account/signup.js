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
                        message:"Lütfen, adınızı ve soyadınızı giriniz."
                    },
                    email: {
                        pattern: new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i),
                        source: "#frm-signup input[name=email]",
                        message: "Lütfen, eposta adresinizi kontrol ediniz"
                    },
                    password: {
                        pattern: new RegExp(/^(([\w|\d]{6,12})$)/i),
                        source: "#frm-signup input[name=password]",
                        message: "Lütfen, şifrenizi kontrol ediniz"
                    },
                    password_confirmation: {
                        pattern: new RegExp(/^(([\w|\d]{6,12})$)/i),
                        source: "#frm-signup input[name=password_confirmation]",
                        message: "Şifreniz doğrulanamıyor, Lütfen kontrol ediniz."
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
                    this.hideFieldMessage("fullname");
                    this.hideFieldMessage("email");
                    this.hideFieldMessage("password");
                    this.hideFieldMessage("password_confirmation");

                    // check elements
                    if ($(this.rules.fullname.source).val().length == 0) {
                        result = false;
                        this.showFieldMessage("error", "fullname");
                    }
                    if (!this.rules.email.pattern.test($(this.rules.email.source).val())) {
                        result = false;
                        this.showFieldMessage("error", "email");
                    }
                    if (!this.rules.password.pattern.test($(this.rules.password.source).val())) {
                        result = false;
                        this.showFieldMessage("error", "password");
                    }
                    if ($(this.rules.password.source).val() != $(this.rules.password_confirmation.source).val()) {
                        result = false;
                        this.showFieldMessage("error", "password_confirmation");
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
                        App.user = response;
                        App.router.navigate("calendar", true);
                    }
                });
            }

            return false;
        }
    });

    return new SignUpPage;
});
