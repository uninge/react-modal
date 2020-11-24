import React, { Component } from 'react';
import { classNames } from './utils';

export interface IFooterBar {
	className?: string;
	showCancel?: boolean;
	showOk?: boolean;
	cancelText?: string;
	okText?: string;
	onCancel?: (event: any) => void,
	onOk?: (event: any) => void;
}

export default class FooterBar extends Component<IFooterBar> {
	constructor(props: Readonly<IFooterBar>) {
		super(props);
		this.state = {};
	}

	render() {
		const {
			className,
			showCancel = true,
			showOk = true,
			cancelText = '取消',
			okText = '确定',
			onCancel,
			onOk,
		} = this.props;

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
