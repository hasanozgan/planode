 // Filename: views/home/main
define([
    'jquery',
    'underscore',
    'backbone',

    'app/views/common/navbar',

    'bootstrap'
], function($, _, Backbone, NavbarView) {

    var SettingsPage = Backbone.View.extend({

        el: $("#account-settings"),

        render: function() {

            var AccountModel = Backbone.Model.extend({
                url: "/account/update",

                rules: {
                    fullname: {
                        pattern: new RegExp(/^(.+)$/i),
                        source: ".frm-account-settings input[name=fullname]",
                        message:"Lütfen, adınızı ve soyadınızı giriniz."
                    },
                    email: {
                        pattern: new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i),
                        source: ".frm-account-settings input[name=email]",
                        message: "Lütfen, eposta adresinizi kontrol ediniz"
                    },
                    password: {
                        pattern: new RegExp(/^(([\w|\d]{6,12})$)/i),
                        source: ".frm-account-settings input[name=password]",
                        message: "Lütfen, şifrenizi kontrol ediniz"
                    },
                    password_confirmation: {
                        pattern: new RegExp(/^(([\w|\d]{6,12})$)/i),
                        source: ".frm-account-settings input[name=password_confirmation]",
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

                    if ($(this.rules.password.source).val().length > 0) {
                        if (!this.rules.password.pattern.test($(this.rules.password.source).val())) {
                            result = false;
                            this.showFieldMessage("error", "password");
                        }
                        if ($(this.rules.password.source).val() != $(this.rules.password_confirmation.source).val()) {
                            result = false;
                            this.showFieldMessage("error", "password_confirmation");
                        }

                        if (result) {
                            this.set({password: hex_md5($(this.rules.password.source).val())});
                        }
                    }
                    if (result) {
                        this.set({
                            fullname: $(this.rules.fullname.source).val(),
                            email: $(this.rules.email.source).val()
                        });
                    }

                    return result;
                }
            });

            this.model = new AccountModel({});

            var base = this;

            require(['text!app/views/account/settings.html'], function(SettingsTemplate) {

                $(".modal").empty();
                var compiledTemplate = _.template( SettingsTemplate, App.user );
                $(compiledTemplate).modal();

                $(".save-account-settings").on('click', function () {
                    var succeed = true;

                    if (base.model.isValid()) {
                        base.model.save(null, {
                            error: function(model, response) {
                                console.log(response)
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
                                NavbarView.render();
                                $(".modal.in").modal('hide');
                            }
                        });
                    }

                    return false;
                });


                //$(compiledTemplate).modal();

            });
        }
    });

    return new SettingsPage ;
});
