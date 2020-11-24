// eslint-disable-next-line max-params
export default function dispatchEvent(eventHandler: any, dispatchedEvent: any, target: any, eventData: any) {
	if (eventHandler) {
		const eventBaseData = {
			target,
			syntheticEvent: dispatchedEvent,
			nativeEvent: dispatchedEvent.nativeEvent,
		};
		eventHandler.call(undefined, { ...eventBaseData, ...eventData });
	}
}
