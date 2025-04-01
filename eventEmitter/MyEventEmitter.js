class MyEventEmitter {
    listeners = {} //key:value

    addListener(eventName, fn) {
        this.listeners[eventName] = this.listeners[eventName] || [];
        this.listeners[eventName].push(fn);
        return this;
    }
    on(eventName,fn) {
        return this.addListener(eventName, fn);
    }
    
    removeListener(eventName,fn) {
        let lis = this.listeners[eventName];
        if(!lis) return this;

        for(let i = lis.length; i > 0; i--){
            if(lis[i] === fn) {
                lis.splice(i,1); //delete curren listener
                break;
            }
        }
        return this;
    }
    off(eventName,fn) {
        return this.removeListener(eventName, fn);
    }
    
    once(eventName,fn) {
        this.listeners[eventName] = this.listeners[eventName] || [];
        const onceHandle = () => {
            fn();
            this.off(eventName, onceHandle)
        };
        this.listeners[eventName].push(onceHandle);
        return this;
    }

    emit(eventName, ...args) {
        let fns = this.listeners[eventName];
        if(!fns) return false;

        fns.forEach(fn => {
            fn(...args);
        });
        return true;
    }

    listenerCount(eventName) {
        let fns = this.listeners[eventName] || [];
        return fns.length;
    }

    // return a copy of the array of listeners based on eventname
    // including once event
    // if once event is emitted, won't show
    rawListeners(eventName) {
        return this.listeners[eventName];
    }

    eventNames(){
        const names = [];
        for (let lis of Object.keys(this.listeners)) {
            names.push(lis)
        }
        return names;
    }

}

module.exports = MyEventEmitter;