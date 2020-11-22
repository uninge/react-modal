import { Component } from 'react';
import PropTypes from 'prop-types';

export default class Optimization extends Component {
	shouldComponentUpdate(nextProps) {
		return nextProps.shouldUpdateOnDrag || !nextProps.isDragging;
	}

	render() {
		return this.props.children;
	}
}

Optimization.propTypes = {
	shouldUpdateOnDrag: PropTypes.bool,
	isDragging: PropTypes.bool,
	children: PropTypes.any,
};
