import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Draggable from './draggable';
import { windowStage } from './utils/config';
import { classNames } from './utils';
import FyMinimize from './assets/fy-minimize.svg';
import FyMaximize from './assets/fy-maximize.svg';
import FyRestore from './assets/fy-restore.svg';
import FyClose from './assets/fy-close.svg';

export default class TitleBar extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const {
			className,
			stage,
			draggable,
			onMinimizeButtonClick,
			onFullScreenButtonClick,
			onRestoreButtonClick,
			onCloseButtonClick,
			onDoubleClick,

			minimizeButton,
			maximizeButton,
			restoreButton,
			closeButton,

			children,
		} = this.props;
		const minimizeButtonRender = minimizeButton ? (
			React.cloneElement(minimizeButton, { stage, onClick: onMinimizeButtonClick })
		) : (
			<button type="button" className="fy-button fy-button-icon" onClick={onMinimizeButtonClick}>
				<FyMinimize className="fy-icon" aria-hidden="true" />
			</button>
		);
		const maximizeButtonRender = maximizeButton ? (
			React.cloneElement(maximizeButton, { stage, onClick: onFullScreenButtonClick })
		) : (
			<button type="button" className="fy-button fy-button-icon" onClick={onFullScreenButtonClick}>
				<FyMaximize className="fy-icon" aria-hidden="true" />
			</button>
		);
		const restoreButtonRender = restoreButton ? (
			React.cloneElement(restoreButton, { stage, onClick: onRestoreButtonClick })
		) : (
			<button type="button" className="fy-button fy-button-icon" onClick={onRestoreButtonClick}>
				<FyRestore className="fy-icon" aria-hidden="true" />
			</button>
		);
		const closeButtonRender = closeButton ? (
			React.cloneElement(closeButton, { stage, onClick: onCloseButtonClick })
		) : (
			<button type="button" className="fy-button fy-button-icon" onClick={onCloseButtonClick}>
				<FyClose className="fy-icon" aria-hidden="true" />
			</button>
		);

		return (
			<Draggable
				onPress={this.props.onPress}
				onDrag={this.props.onDrag}
				onRelease={this.props.onRelease}
			>
				<div
					style={{ touchAction: 'none', cursor: draggable ? 'move' : 'default' }}
					className={classNames('fy-window-title-bar', className)}
					onDoubleClick={onDoubleClick}
				>
					<div className="window-title">{children || ''}</div>
					<div className="window-actions">
						{stage === windowStage.DEFAULT && minimizeButtonRender}
						{stage === windowStage.DEFAULT && maximizeButtonRender}
						{stage !== windowStage.DEFAULT && restoreButtonRender}
						{closeButtonRender}
					</div>
				</div>
			</Draggable>
		);
	}
}

TitleBar.propTypes = {
	className: PropTypes.string,
	stage: PropTypes.oneOf(Object.keys(windowStage)),
	draggable: PropTypes.bool,
	onMinimizeButtonClick: PropTypes.func,
	onFullScreenButtonClick: PropTypes.func,
	onRestoreButtonClick: PropTypes.func,
	onCloseButtonClick: PropTypes.func,
	onDoubleClick: PropTypes.func,

	minimizeButton: PropTypes.element,
	maximizeButton: PropTypes.element,
	restoreButton: PropTypes.element,
	closeButton: PropTypes.element,

	onPress: PropTypes.func,
	onDrag: PropTypes.func,
	onRelease: PropTypes.func,

	children: PropTypes.any,
};

TitleBar.defaultProps = {
	stage: windowStage.DEFAULT,
};
