// Filename: views/home/main
define([
    'jquery',
    'underscore',
    'backbone',

    'app/views/event/create',
    'app/views/event/edit',

    'bootstrap',
    'fullcalendar'
], function($, _, Backbone, CreateEventView, EditEventView) {

    var CalendarPage = Backbone.View.extend({

        el: $("#page"),

        timeline: function(curCalView) {
            var parentDiv = jQuery(".fc-agenda-slots:visible").parent();
            var timeline = parentDiv.children(".timeline");
            if (timeline.length == 0) { //if timeline isn't there, add it
                timeline = jQuery("<hr>").addClass("timeline");
                parentDiv.prepend(timeline);
            }

            var curTime = new Date();

            //var curCalView = this.el.fullCalendar('getView');
            if (curCalView.visStart < curTime && curCalView.visEnd > curTime) {
                timeline.show();
            } else {
                timeline.hide();
                return;
            }

            var curSeconds = (curTime.getHours() * 60 * 60) + (curTime.getMinutes() * 60) + curTime.getSeconds();
            var percentOfDay = curSeconds / 86400; //24 * 60 * 60 = 86400, # of seconds in a day
            var topLoc = Math.floor(parentDiv.height() * percentOfDay);

            timeline.css("top", topLoc + "px");

            if (curCalView.name == "agendaWeek") { //week view, don't want the timeline to go the whole way across
                var dayCol = jQuery(".fc-today:visible");
                var left = dayCol.position().left + 1;
                var width = dayCol.width()-2;
                timeline.css({
                    left: left + "px",
                    width: width + "px"
                });
            }

        },

        render: function() {
            var parent = this;

            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            $("#page").empty();
            $("#page").fullCalendar({
                header: {
                    left: 'title',
                    center: ' ',
                    right: 'today,month,agendaWeek,agendaDay,agenda prev,next'
                },

                viewDisplay: function(view) {
                    try {

                        parent.timeline(view);
                    } catch(err) {}
                },

                editable: false,

                // time formats
                titleFormat: {
                    month: 'MMMM yyyy',
                    week: "d[ yyyy] [MMM] { '&#8212;' d MMM yyyy}",
                    //week: "d[ yyyy]{ '&#8212;'[ MMM] d MMM yyyy}",
                    day: 'dddd, d MMM yyyy',
                    agenda: 'dddd, d MMM yyyy'
                },
                columnFormat: {
                    month: 'ddd',
                    week: 'd/M ddd',
                    day: 'dddd, d MMM',
                    agenda: 'dddd, d MMM'
                },
                timeFormat: { // for event elements
                    '': 'h(:mm)t' // default
                },

                dayClick: function(date, allDay, jsEvent, view) {
                    CreateEventView.render();
                },


                eventRender: function (event, element, view) {
                    /*
                    console.log(event);
                    console.log(element);
                    console.log(view);*/
                    element.popover({
                        title: event.title,
                        content: '<span class="title">Start: </span>' +
                            ($.fullCalendar.formatDate(event.start, 'hh:mmtt')) +
                            '<br><span class="title">Description: </span>' + event.start,
                        trigger:'hover',
                        placement: (event.allDay ? 'bottom' : 'top'),
                        delay: { show: 500, hide: 50 }
                    });
                    element.click(function() {
                        element.popover('hide');
                        EditEventView.render();
                    });

                },


                firstDay: 1,
                monthNames: ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'],
                monthNamesShort: ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'],
                dayNames: ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'],
                dayNamesShort: ['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'],
                allDayText: 'tüm-gün',
                buttonText: {
                    prev: '&nbsp;&#9668;&nbsp;',
                    next: '&nbsp;&#9658;&nbsp;',
                    prevYear: '&nbsp;&lt;&lt;&nbsp;',
                    nextYear: '&nbsp;&gt;&gt;&nbsp;',
                    today: 'Bugüne Git',
                    month: 'Aylık',
                    week: 'Haftalık',
                    day: 'Günlük',
                    agenda: 'Ajanda'
                },

                //events: '/myfeed.php'//,


                events: [
                    {
                        title: 'All Day Event',
                        start: new Date(y, m, 1),
                        className:'calendar-01'
                    },
                    {
                        title: 'Long Event',
                        className:'calendar-02',
                        start: new Date(y, m, d-5),
                        end: new Date(y, m, d-2)
                    },
                    {
                        id: 999,
                        title: 'Repeating Event',
                        className:'calendar-03',
                        start: new Date(y, m, d-3, 16, 0),
                        allDay: false
                    },
                    {
                        id: 999,
                        title: 'Repeating Event',
                        className:'calendar-03',
                        start: new Date(y, m, d+4, 16, 0),
                        allDay: false
                    },
                    {
                        title: 'Meeting',
                        className:'calendar-04',
                        start: new Date(y, m, d, 10, 30),
                        allDay: false
                    },
                    {
                        title: 'Lunch',
                        className:'calendar-05',
                        start: new Date(y, m, d, 12, 0),
                        end: new Date(y, m, d, 14, 0),
                        allDay: false
                    },
                    {
                        title: 'Birthday Party',
                        className:'calendar-06',
                        start: new Date(y, m, d+1, 19, 0),
                        end: new Date(y, m, d+1, 22, 30),
                        allDay: false
                    },
                    {
                        calendar: 'tttt',
                        title: 'Click for Google',
                        start: new Date(y, m, 28),
                        end: new Date(y, m, 29),
                        url: 'http://google.com/'
                    }
                ]
            });




        }
    });

    return new CalendarPage;
});
