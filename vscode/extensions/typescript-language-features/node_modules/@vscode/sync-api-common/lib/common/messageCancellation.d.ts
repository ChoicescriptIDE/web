export declare namespace Cancellation {
    /**
     * Adds cancellation data to a message. Such a message is usually send via
     * `MessagePort.postMessage` to another web worker using a *asynchronous*
     * message channel. The function is therefore called on the sending side
     * of a message.
     *
     * The cancellation data is stored using the property `$cancellationData`
     * on the provided message object.
     *
     * @param message The message to add cancellation data to.
     * @returns A function when called cancels the message.
     */
    function addData(message: object): () => void;
    /**
     * Return for the given message a function that if call indicates whether
     * the message got canceled or not. The necessary cancellation data is
     * expected to be stored under the property `$cancellationData` and must
     * be of type `SharedArrayBuffer`. The function is usually called on the
     * receiving side of a message.

     * @param message The given message.
     * @returns a function to check if the message got canceled.
     */
    function retrieveCheck(message: object): () => boolean;
}
