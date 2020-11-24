import React, { Component } from 'react';

import { DraggableCore } from './utils';
import {
	IDraggableCoreMouseDragEvent as MouseDragEvent,
	IDraggableCoreTouchDragEvent as TouchDragEvent,
} from './utils/draggable-core';

export interface IDraggableEvent {
	target: any,
	event: MouseDragEvent | TouchDragEvent ,
	element: HTMLElement,
}

export interface IDraggable {
	onPress?: (e: IDraggableEvent) => void;
	onDrag?: (e: IDraggableEvent) => void;
	onRelease?: (e: IDraggableEvent) => void;
	children: React.ReactElement;
}

export default class Draggable extends Component<IDraggable> {
	private element: null | HTMLElement;
	private readonly assignRef: (element: HTMLElement) => void;
	private draggable: DraggableCore;

	constructor(props: Readonly<IDraggable>) {
		super(props);

		const { onPress, onDrag, onRelease } = props;

		this.element = null;
		this.assignRef = element => {
			if (!element || this.element === element) return;
			this.element = element;
		};

		this.draggable = new DraggableCore({
			press: event => {
				if (this.element && onPress) {
					onPress.call(undefined, {
						event,
						target: this,
						element: this.element,
					});
				}
			},
			drag: event => {
				if (this.element && onDrag) {
					onDrag.call(undefined, {
						event,
						target: this,
						element: this.element,
					});
				}
			},
			release: event => {
				if (this.element && onRelease) {
					onRelease.call(undefined, {
						event,
						target: this,
						element: this.element,
					});
				}
			},
		});
	}

	componentDidMount() {
		if (this.element) {
			this.draggable.bindTo(this.element);
		}
	}

	componentWillUnmount() {
		this.draggable.destroy();
	}

	render() {
		const { children } = this.props;
		return React.cloneElement(React.Children.only(children), {
			ref: this.assignRef,
		});
	}
}
