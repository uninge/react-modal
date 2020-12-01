import React, { Component } from 'react';

import Draggable, { IDraggableEvent } from './draggable';
import { windowStage } from './utils/config';
import { classNames } from './utils';
import IconMinimize from './assets/icon-minimize.svg';
import IconMaximize from './assets/icon-maximize.svg';
import IconRestore from './assets/icon-restore.svg';
import IconClose from './assets/icon-close.svg';

export interface ITitleBar {
	className?: string;
	stage?: string;
	draggable?: boolean;
	onMinimizeButtonClick?: (event: React.MouseEvent) => void;
	onFullScreenButtonClick?: (event: React.MouseEvent) => void;
	onRestoreButtonClick?: (event: React.MouseEvent) => void;
	onCloseButtonClick?: (event: React.MouseEvent) => void;
	onDoubleClick?: (event: React.MouseEvent) => void;

	minimizeButton?: React.ReactElement;
	maximizeButton?: React.ReactElement;
	restoreButton?: React.ReactElement;
	closeButton?: React.ReactElement;

	onPress?: (event: IDraggableEvent) => void;
	onDrag?: (event: IDraggableEvent) => void;
	onRelease?: (event: IDraggableEvent) => void;

	children?: React.ReactElement | string | undefined | null;
}

export default class TitleBar extends Component<ITitleBar> {
	constructor(props: Readonly<ITitleBar>) {
		super(props);
		this.state = {};
	}

	render() {
		const {
			className,
			stage = windowStage.DEFAULT,
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
			<button type="button" className="rm-button rm-button-icon" onClick={onMinimizeButtonClick}>
				{/* @ts-ignore */}
				<IconMinimize className="rm-icon" aria-hidden="true" />
			</button>
		);
		const maximizeButtonRender = maximizeButton ? (
			React.cloneElement(maximizeButton, { stage, onClick: onFullScreenButtonClick })
		) : (
			<button type="button" className="rm-button rm-button-icon" onClick={onFullScreenButtonClick}>
				{/* @ts-ignore */}
				<IconMaximize className="rm-icon" aria-hidden="true" />
			</button>
		);
		const restoreButtonRender = restoreButton ? (
			React.cloneElement(restoreButton, { stage, onClick: onRestoreButtonClick })
		) : (
			<button type="button" className="rm-button rm-button-icon" onClick={onRestoreButtonClick}>
				{/* @ts-ignore */}
				<IconRestore className="rm-icon" aria-hidden="true" />
			</button>
		);
		const closeButtonRender = closeButton ? (
			React.cloneElement(closeButton, { stage, onClick: onCloseButtonClick })
		) : (
			<button type="button" className="rm-button rm-button-icon" onClick={onCloseButtonClick}>
				{/* @ts-ignore */}
				<IconClose className="rm-icon" aria-hidden="true" />
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
					className={classNames('rm-window-title-bar', className)}
					onDoubleClick={onDoubleClick}
				>
					<div className="window-title">
						<span className="text">{children || ''}</span>
					</div>
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
