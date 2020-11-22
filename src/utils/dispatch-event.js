/**
 * @param eventHandler - The public event handler that is assigned by the user.
 * When undefined, the method is not an option.
 * @param dispatchedEvent - The event that was already dispatched internally.
 * @param target - The target component of the new event.
 * @param eventData - The additional data that will be passed through the new event.
 * When the new event has no additional data
 *  other than the `BaseEvent` arguments, pass `undefined`.
 */
// eslint-disable-next-line max-params
export default function dispatchEvent(eventHandler, dispatchedEvent, target, eventData) {
	if (eventHandler) {
		const eventBaseData = {
			target,
			syntheticEvent: dispatchedEvent,
			nativeEvent: dispatchedEvent.nativeEvent,
		};
		eventHandler.call(undefined, { ...eventBaseData, ...eventData });
	}
}
