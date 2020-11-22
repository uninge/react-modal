import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DraggableCore } from './utils';

export default class Draggable extends Component {
	constructor(props) {
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
						target: this,
						event,
						element: this.element,
					});
				}
			},
			drag: event => {
				if (this.element && onDrag) {
					onDrag.call(undefined, {
						target: this,
						event,
						element: this.element,
					});
				}
			},
			release: event => {
				if (this.element && onRelease) {
					onRelease.call(undefined, {
						event,
						target: this,
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

Draggable.propTypes = {
	onPress: PropTypes.func,
	onDrag: PropTypes.func,
	onRelease: PropTypes.func,
	children: PropTypes.element.isRequired,
};
