// Filename: views/home/main
define([
    'jquery',
    'underscore',
    'backbone',

    'bootstrap'
], function($, _, Backbone) {

    var SettingsPage = Backbone.View.extend({

        el: $("#account-settings"),

        render: function() {

            var OrganizationModel = Backbone.Model.extend({
                url: "/organization/add",

                rules: {
                    name: {
                        pattern: new RegExp(/^(.+)$/i),
                        source: ".frm-organization input[name=name]",
                        message:"Lütfen, organizasyon adını giriniz."
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
                    this.hideFieldMessage("name");

                    // check elements
                    if ($(this.rules.name.source).val().length == 0) {
                        result = false;
                        this.showFieldMessage("error", "name");
                    }
                    if (result) {
                        this.set({
                            name: $(this.rules.name.source).val(),
                        });
                    }

                    return result;
                }
            });

            this.model = new OrganizationModel({});

            var base = this;

            require(['text!app/views/organization/add.html',
                     'app/views/common/sidebar'], function(OrganizationTemplate, SideBarView) {

                $(".modal").empty();
                var compiledTemplate = _.template( OrganizationTemplate, {_:_} );
                $(compiledTemplate).modal();

                $(".save-organization-add").on('click', function () {
                    var succeed = true;

                    if (base.model.isValid()) {
                        base.model.save(null, {
                            error: function(model, response) {
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
                                App.addOrganization(response);
                                SideBarView.render(true);
                                $(".modal-organization-add.in").modal('hide');
                            }
                        });
                    }

                    return false;
                });

            });
        }
    });

    return new SettingsPage ;
});
