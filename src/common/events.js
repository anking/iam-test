/* eslint-disable no-native-reassign */

//Event Polyfill for IE
(() => {
    if (typeof window.CustomEvent === "function") return false //If not IE

    CustomEvent = (event, params) => {
        params = params || { bubbles: false, cancelable: false, detail: undefined }
        var evt = document.createEvent('CustomEvent')
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
        return evt
    }

    CustomEvent.prototype = window.Event.prototype

    window.CustomEvent = CustomEvent
})()

//Application-wide events
export default class Events {    
    //static menuOpenedEvent = new CustomEvent('sss-mainMenuOpened')
    //static menuClosedEvent = new CustomEvent('sss-mainMenuClosed')
    static zdLogout = new CustomEvent('zd-logout')
}
