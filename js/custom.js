$(function () {

    var inst = $('#demo-list-agenda').mobiscroll().eventcalendar({
        theme: 'ios',
        themeVariant: 'light',
        display: 'inline',
        view: {
            calendar: { type: 'month' },
            eventList: { type: 'month', scrollable: true }
        }
    }).mobiscroll('getInst');

    mobiscroll.util.getJson('https://trial.mobiscroll.com/events/', function (events) {
        inst.setEvents(events);
    }, 'jsonp');


     var monthInst,
        dayInst,
        popupInst,
        dateInst,
        preventSet,
        now = new Date(),
        btn = '<button class="mbsc-btn mbsc-btn-outline mbsc-btn-danger md-delete-btn mbsc-ios">Delete</button>',
        myData = [{
            start: new Date(now.getFullYear(), now.getMonth(), 8, 13),
            end: new Date(now.getFullYear(), now.getMonth(), 8, 13, 30),
            text: 'Lunch @ Butcher\'s' + btn,
            color: '#26c57d'
        }, {
            start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15),
            end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16),
            text: 'General orientation' + btn,
            color: '#fd966a'
        }, {
            start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 18),
            end: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 22),
            text: 'Dexter BD' + btn,
            color: '#37bbe4'
        }, {
            start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 30),
            end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 11, 30),
            text: 'Stakeholder mtg.' + btn,
            color: '#d00f0f'
        }];

    function navigate(inst, val) {
        if (inst) {
            inst.navigate(val);
        }
    }

    dateInst = $('#eventDate').mobiscroll().range({
        controls: ['date', 'time'],
        dateWheels: '|D M d|',
        endInput: '#endInput',
        tabs: false,
        responsive: {
            large: {
                touchUi: false
            }
        },
        showSelector: false,
        cssClass: 'md-add-event-range'
    }).mobiscroll('getInst');

    dayInst = $('#demo-add-event-day').mobiscroll().eventcalendar({
        display: 'inline',
        view: {
            eventList: { type: 'year', scrollable: true }
        },
        data: myData,
        onPageChange: function (event, inst) {
            var day = event.firstDay;
            preventSet = true;
            navigate(monthInst, day);
            dateInst.setVal([day, new Date(day.getFullYear(), day.getMonth(), day.getDate(), day.getHours() + 2)], true);
        },
        onEventSelect: function (event, inst) {
            if ($(event.domEvent.target).hasClass('md-delete-btn')) {
                mobiscroll.confirm({
                    title: 'Confirm Deletion',
                    message: 'Are you sure you want to delete this item?',
                    okText: 'Delete',
                    callback: function (res) {
                        if (res) {
                            inst.removeEvent([event.event._id]);
                            monthInst.removeEvent([event.event._id]);
                            mobiscroll.toast({
                                message: 'Deleted'
                            });
                        }
                    }
                });
            }
        }
    }).mobiscroll('getInst');

    monthInst = $('#demo-add-event-month').mobiscroll().eventcalendar({
        display: 'inline',
        view: {
            calendar: { type: 'month' }
        },
        data: myData,
        onSetDate: function (event, inst) {
            if (!preventSet) {
                var day = event.date;
                navigate(dayInst, day);
                dateInst.setVal([day, new Date(day.getFullYear(), day.getMonth(), day.getDate(), day.getHours() + 2)], true);
            }
            preventSet = false;
        }
    }).mobiscroll('getInst');

    $('#allDay').on('change', function () {
        var allDay = this.checked;

        dateInst.option({
            controls: allDay ? ['date'] : ['date', 'time'],
            dateWheels: (allDay ? 'MM dd yy' : '|D M d|')
        });
    });

    popupInst = $('#demo-add-event-popup').mobiscroll().popup({
        display: 'center',
        cssClass: 'mbsc-no-padding',
        buttons: [{
                text: 'Add event',
                handler: 'set'
            },
            'cancel'
        ],
        headerText: 'Add new event',
        onSet: function (event, inst) {
            var eventDates = dateInst.getVal(),
                events = {
                    start: eventDates[0],
                    end: eventDates[1],
                    text: ($('#eventText').val() || 'New Event') + btn,
                    title: $('#eventText').val() || 'New Event',
                    description: $('#eventDesc').val(),
                    allDay: $('#allDay').prop('checked'),
                    free: $('input[name=free]:checked').val() == 'true'
                };
            monthInst.addEvent(events);
            dayInst.addEvent(events);
            $('#eventText').val('');
            $('#eventDesc').val('');
            // Navigate the calendar to the new event's start date
            monthInst.navigate(eventDates[0], true);
        }
    }).mobiscroll('getInst');

    $('#showAddEventPopup').click(function () {
        popupInst.show();
    });

});

