export declare class UniversalEventEmitter {
    private _events;
    /**
     * Registers an event listener
     * @param {string} event - event name
     * @param {Function} listener - function to be called when event occurs
     */
    on(event: string, listener: Function): void;
    /**
     * Registers a one-time event listener
     * @param {string} event - event name
     * @param {Function} listener - function to be called once
     */
    once(event: string, listener: Function): void;
    /**
     * Removes an event listener
     * @param {string} event - event name
     * @param {Function} [listener] - optional: specific listener to remove
     */
    off(event?: string, listener?: Function): void;
    /**
     * Emits an event
     * @param {string} event - event name
     * @param {...any} args - arguments to be passed to listeners
     */
    emit(event: string, ...args: any[]): void;
    /**
     * Returns the number of listeners for the given event
     */
    listenerCount(event: string): number;
}
