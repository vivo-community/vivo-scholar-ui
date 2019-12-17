// https://itnext.io/handling-data-with-web-components-9e7e4a452e6e
class EventBus {
    constructor() {
      //this._bus = document.createElement('div');
    }
  
    register(event, callback) {
      //this._bus.addEventListener(event, callback);
      window.addEventListener(event, callback);
    } 
      
    remove(event, callback) {
      //this._bus.removeEventListener(event, callback);
      window.removeEventListener(event, callback);
    }  
    
    fire(evt) {
      //this._bus.dispatchEvent(evt);
      window.dispatchEvent(evt);
    }
  }
  
var bus = new EventBus();
export default bus;