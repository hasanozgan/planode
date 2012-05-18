// Filename: views/home/main
define([
    'jquery',
    'underscore',
    'backbone',

    'app/views/common/sidebar',

    'bootstrap',
    'fullcalendar'

], function($, _, Backbone, SideBarView) {

    var OrganizationPage = Backbone.View.extend( {
        el: $("#page"),

        organization_id: 0,

        events: {
            "click .delete-organization": "deleteOrganization",
            "click .update-organization": "updateOrganization"
        },

        updateOrganization: function() {

            var OrganizationModel = Backbone.Model.extend({
                url: "/organization/update",

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

            var organizationModel = new OrganizationModel({});
            organizationModel.set({id: this.organization_id});

            var succeed = true;

            if (organizationModel.isValid()) {
                organizationModel.save(null,
                    {
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
                            App.editOrganization(response);
                            SideBarView.render(true);
                        }
                    }
                );
            }

            return false;
        },

        deleteOrganization: function() {
            var base = this;
            $.ajax({
                url: "/organization/delete/"+this.organization_id,
                type: "DELETE",
                success: function() {
                    App.deleteOrganization(base.organization_id);
                    App.router.navigate("calendar", true);
                    return false;
                }
            });

            return false;
        },

        render: function(pOrganizationId) {

            this.organization_id = pOrganizationId;

            require(['text!app/views/organization/settings.html'], function(OrganizationTemplate) {

                var compiledTemplate = _.template( OrganizationTemplate, { "organization_name": App.getOrganization(pOrganizationId).name } );

                $("#page").empty();
                $("#page").html(compiledTemplate);

                $('a[data-toggle="tab"]').on('shown', function (e) {
                    console.log($(e.target).attr("href"));
                    e.target // activated tab
                    e.relatedTarget // previous tab
                })
            });
        }

    });

    return new OrganizationPage;
});
