package com.wiley.views.webview.events;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class UrlLoadingEvent extends Event<UrlLoadingEvent> {
    public static final String EVENT_NAME = "urlLoading";
    private WritableMap eventData;

    public UrlLoadingEvent(int viewId, WritableMap eventData) {
        super(viewId);
        this.eventData = eventData;
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public boolean canCoalesce() {
        return false;
    }

    @Override
    public void dispatch(final RCTEventEmitter rctEventEmitter) {
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), eventData);
    }
}
