// Filename: views/home/main
define([
    'jquery',
    'underscore',
    'backbone',

    'app/views/common/sidebar',

    'bootstrap',
    'fullcalendar'

], function($, _, Backbone, SideBarView) {

    var CategoryPanel = Backbone.View.extend( {
        el: $("#page"),

        organization_id: 0,

        events: {
            "click .add-category": "addCategory"
        },

        addCategory: function() {

            if ($("#category_name").val().length == 0) {
                return false;
            }

            $(".category-list").prepend("<li>"+
                "<div class='organization-item'>"+$("#category_name").val()+"</div>"+
                "<div class='organization-actions'><a href='#remove-action' class='remove'><i class='icon-remove'></i> Sil</a></div>"+
                "</li>");

            $("#category_name").val("");
            $("#category_name").focus();

            $(".category-list > li").mouseover(function() {
                $(this).find(".organization-item").addClass("active");
                $(this).find(".organization-actions").addClass("active");
            });

            $(".category-list > li").mouseout(function() {
                $(this).find(".organization-item").removeClass("active");
                $(this).find(".organization-actions").removeClass("active");
            });

            return false;
        },


        render: function(pOrganizationId) {

            this.organization_id = parseInt(pOrganizationId);

            require(['text!app/views/organization/category.html'], function(CategoryTemplate) {

                var compiledTemplate = _.template( CategoryTemplate, {} );

                $("#category").empty();
                $("#category").html(compiledTemplate);
            });
        }

    });

    return new CategoryPanel;
});
