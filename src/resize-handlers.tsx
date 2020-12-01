import React from 'react';

import Draggable from './draggable';
import { directions } from './utils/config';
import {
	IDraggableCoreMouseDragEvent as MouseDragEvent,
	IDraggableCoreTouchDragEvent as TouchDragEvent,
} from './utils/draggable-core';

export interface IPropsEvent {
	target: any,
	event: TouchDragEvent | MouseDragEvent ,
	element: HTMLElement,
}

export interface IResizeHandlers {
	onResize: (e: TouchDragEvent | MouseDragEvent, params: { direction: string; end: boolean }) => void;
}

export default function ResizeHandlers(props: Readonly<IResizeHandlers>) {
	const { onResize } = props;
	function onDrag(data: IPropsEvent, key: string) {
		const event = data.event;

		event.originalEvent.preventDefault();

		if (onResize) {
			onResize(event, { direction: key, end: false });
		}
	}

	function onRelease(data: IPropsEvent, key: string) {
		const event = data.event;

		event.originalEvent.preventDefault();

		if (onResize) {
			onResize(event, { direction: key, end: true });
		}
	}

	return (
		<div>
			{directions.map((key) => (
				<Draggable
					key={key}
					onDrag={(data: IPropsEvent) => onDrag(data, key)}
					onRelease={(data: IPropsEvent) => onRelease(data, key)}
				>
					<div
						style={{ display: 'block', touchAction: 'none' }}
						className={`rm-resize-handle ${key}`}
					/>
				</Draggable>
			))}
		</div>
	);
}
