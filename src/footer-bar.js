import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { classNames } from './utils';

export default class FooterBar extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { className, showCancel, showOk, cancelText, okText, onCancel, onOk } = this.props;

		return (
			<div className={classNames('fy-window-footer', className)}>
				{showCancel && (
					<button type="button" className="fy-button footer-button" onClick={onCancel}>
						{cancelText}
					</button>
				)}
				{showOk && (
					<button type="button" className="fy-button footer-button button-primary" onClick={onOk}>
						{okText}
					</button>
				)}
			</div>
		);
	}
}

FooterBar.propTypes = {
	className: PropTypes.string,
	showCancel: PropTypes.bool,
	showOk: PropTypes.bool,
	cancelText: PropTypes.string,
	okText: PropTypes.string,
	onCancel: PropTypes.func,
	onOk: PropTypes.func,
};

FooterBar.defaultProps = {
	showCancel: true,
	showOk: true,
	cancelText: '取消',
	okText: '确定',
};
