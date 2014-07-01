Ext.define('EIM.controller.Calendars', {
    extend: 'Ext.app.Controller',

    views: [
        'calendar.Panel'
    ],
    stores: [
//        'CalendarLists'
    ],

    init: function() {

        this.control({
            'calendar_panel datepicker': {
                select: this.updateEventCalendar
            },
            'calendar_panel panel[title=日程安排]': {
                beforeeventdelete: this.confirmDelete,
                eventadd: this.reloadView
            }
        });
    },

    updateEventCalendar: function(datepicker, date) {
        var event_calendar = datepicker.up('calendar_panel').down('panel[title=日程安排]', false);
//        console.log(datepicker.up('calendar_panel').down('panel', false));
//        console.log(datepicker.up('calendar_panel').down('panel[title=日程安排]', false));
//        console.log(event_calendar);
        event_calendar.setStartDate(date);
    },

    confirmDelete: function(calendar_panel, record) {
        var me = this;
        Ext.Msg.confirm('确认删除', '真的要删除选中的日程？', function(button) {
            if(button === 'yes') {
                Ext.Ajax.request({
                    url: '/calendars/rest_calendar',
                    method: 'DELETE',
                    params: {
                        id: record.internalId
                    },
                    submitEmptyText: false,
                    success: function(response) {
                        var msg = Ext.decode(response.responseText);
                        Ext.example.msg('成功', msg.message);
                        //                                    calendar_panel.setStartDate();
                        me.reloadView(calendar_panel);
                    },
                    failure: function() {
                        Ext.Msg.alert('错误','可能是网络问题，请找Terry处理');
                    }
                });
            }
        });

        return false;
    },

    reloadView: function(calendar_panel) {
        calendar_panel.store.load({
            params: {
                startDate: Ext.Date.add(calendar_panel.startDate,Ext.Date.DAY,-30),
                endDate: Ext.Date.add(calendar_panel.startDate,Ext.Date.DAY,30)
            }
        });
    }
});