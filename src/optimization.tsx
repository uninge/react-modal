import React, { Component } from 'react';

export interface IOptimization {
	shouldUpdateOnDrag: boolean;
	isDragging: boolean;
	children: React.ReactElement;
}

export default class Optimization extends Component<IOptimization> {
	shouldComponentUpdate(nextProps: Readonly<IOptimization>) {
		return nextProps.shouldUpdateOnDrag || !nextProps.isDragging;
	}

	render() {
		return this.props.children;
	}
}
