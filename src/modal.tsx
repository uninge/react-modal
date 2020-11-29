import React, { Component } from 'react';
import { createPortal } from 'react-dom';

import Optimization from './optimization';
import TitleBar from './title-bar';
import FooterBar from './footer-bar';
import ResizeHandlers from './resize-handlers';
import { classNames, dispatchEvent } from './utils';
import {
	DEFAULT_WIDTH,
	DEFAULT_HEIGHT,
	DEFAULT_MIN_WIDTH,
	DEFAULT_MIN_HEIGHT,
	DEFAULT_STEP,
	windowStage,
	keys,
} from './utils/config';
import { IDraggableEvent } from './draggable';
import {
	IDraggableCoreMouseDragEvent as MouseDragEvent,
	IDraggableCoreTouchDragEvent as TouchDragEvent,
} from './utils/draggable-core';

export interface IStageChangeEvent {
	nativeEvent: MouseEvent;
	state: string;
	syntheticEvent: React.MouseEvent;
	target: Modal;
}

export interface IModalEvent {
	width: number;
	height: number;
	top: number;
	left: number;
	target: Modal;
	nativeEvent: PointerEvent,
	drag: boolean;
	end: boolean;
}

export interface IModalProps {
	appendContainer?: HTMLElement;
	visible?: boolean;
	theme?: string;
	keyboard?: boolean;
	mask?: boolean;
	maskStyle?: { [key: string]: string | number };
	maskClassName?: string;
	maskClosable?: boolean;
	shouldUpdateOnDrag?: boolean;
	stage?: string;
	onCancel?: () => void;
	onOk?: () => void;

	// draggable、resizable
	draggable?: boolean;
	resizable?: boolean;
	stageChangeByDoubleClick?: boolean;
	onMove?: (event: MouseDragEvent | TouchDragEvent | IDraggableEvent | IStageChangeEvent | IModalEvent) => void;
	onResize?: (event: MouseDragEvent | TouchDragEvent | IDraggableEvent | IStageChangeEvent | IModalEvent) => void;
	onStageChange?: (event: IStageChangeEvent) => void;

	// container styles
	style?: { [key: string]: string | number };
	className?: string;
	width?: number;
	height?: number;
	top?: number;
	left?: number;
	initialWidth?: number;
	initialHeight?: number;
	initialTop?: number;
	initialLeft?: number;
	minWidth?: number;
	minHeight?: number;
	zIndex?: number;

	// title bar
	title?: string;
	titleBarClassName?: string;
	minimizeButton?: React.ReactElement;
	maximizeButton?: React.ReactElement;
	restoreButton?: React.ReactElement;
	closeButton?: React.ReactElement;

	// content
	contentClassName?: string;
	children?: React.ReactElement;

	// footer
	footerClassName?: string;
	showCancel?: boolean;
	showOk?: boolean;
	cancelText?: string;
	okText?: string;
}

export interface IModalState {
	stage?: string;
	width: number;
	height: number;
	top: number;
	left: number;
	isDragging: boolean;
}

export default class Modal extends Component<IModalProps, IModalState> {
	private windowCoordinatesState: {
		leftBeforeAction: number;
		widthBeforeAction: number;
		topBeforeAction: number;
		differenceLeft: number;
		differenceTop: number;
		heightBeforeAction: number;
	};
	constructor(props: Readonly<IModalProps>) {
		super(props);
		this.state = {
			stage: props.stage || windowStage.DEFAULT,
			width: this.getInitialWidth(),
			height: this.getInitialHeight(),
			top: this.getInitialTop(),
			left: this.getInitialLeft(),
			isDragging: false,
		};

		this.windowCoordinatesState = {
			widthBeforeAction: this.getInitialWidth(),
			heightBeforeAction: this.getInitialHeight(),
			topBeforeAction: this.getInitialTop(),
			leftBeforeAction: this.getInitialLeft(),
			differenceTop: 0,
			differenceLeft: 0,
		};
	}

	onHandleKeyDown = (event: React.KeyboardEvent) => {
		const { keyboard = true, resizable = true } = this.props;
		const minWidth = this.props.minWidth || DEFAULT_MIN_WIDTH;
		const minHeight = this.props.minHeight || DEFAULT_MIN_HEIGHT;

		if (!keyboard) {
			return;
		}

		if (event.target !== event.currentTarget) {
			return;
		}

		// resize
		if (event.ctrlKey && resizable) {
			switch (event.keyCode) {
				case keys.up:
					event.preventDefault();
					// eslint-disable-next-line max-depth
					if (minHeight <= this.height - DEFAULT_STEP) {
						this.setState({ height: this.height - DEFAULT_STEP });
					}
					break;
				case keys.right:
					this.setState({ width: this.width + DEFAULT_STEP });
					break;
				case keys.down:
					event.preventDefault();
					this.setState({ height: this.height + DEFAULT_STEP });
					break;
				case keys.left:
					// eslint-disable-next-line max-depth
					if (minWidth <= this.width - DEFAULT_STEP) {
						this.setState({ width: this.width - DEFAULT_STEP });
					}
					break;
				default:
					return;
			}
			if (this.props.onResize) {
				this.dispatchMoveEvent(this.props.onResize, event, false, false);
			}
			return;
		}

		// stage change: default、fullscreen、minimized
		if (event.altKey) {
			switch (event.keyCode) {
				case keys.up:
					// eslint-disable-next-line max-depth
					if (this.windowStage === windowStage.MINIMIZED) {
						this.handleRestore(event);
						dispatchEvent(this.props.onStageChange, event, this, { state: windowStage.DEFAULT });
					} else if (this.windowStage === windowStage.DEFAULT) {
						this.handleFullscreen(event);
						dispatchEvent(this.props.onStageChange, event, this, { state: windowStage.FULLSCREEN });
					}
					break;
				case keys.down:
					if (this.windowStage === windowStage.FULLSCREEN) {
						this.handleRestore(event);
						dispatchEvent(this.props.onStageChange, event, this, { state: windowStage.DEFAULT });
					} else if (this.windowStage === windowStage.DEFAULT) {
						this.handleMinimize(event);
						dispatchEvent(this.props.onStageChange, event, this, { state: windowStage.MINIMIZED });
					}
					break;
				default:
			}
			return;
		}

		// move
		if (!event.ctrlKey) {
			switch (event.keyCode) {
				case keys.esc:
					if (this.props.onCancel) {
						event.preventDefault();
						this.handleCloseWindow(event);
					}
					return;
				case keys.up:
					this.setState({ top: this.state.top - DEFAULT_STEP });
					break;
				case keys.right:
					this.setState({ left: this.state.left + DEFAULT_STEP });
					break;
				case keys.down:
					this.setState({ top: this.state.top + DEFAULT_STEP });
					break;
				case keys.left:
					this.setState({ left: this.state.left - DEFAULT_STEP });
					break;
				default:
					return;
			}
		}

		if (this.props.onMove) {
			this.dispatchMoveEvent(this.props.onMove, event, false, false);
		}
	};

	// eslint-disable-next-line max-params
	dispatchMoveEvent(
		callback: { (event: IStageChangeEvent | IModalEvent): void },
		event: any,
		drag: boolean,
		end: boolean,
	) {
		if (!callback) {
			return;
		}
		callback.call(undefined, {
			nativeEvent: event.nativeEvent ? event.nativeEvent : event.originalEvent,
			drag,
			end,
			target: this,
			width: this.state.width,
			height: this.state.height,
			top: this.state.top,
			left: this.state.left,
		});
	}

	// eslint-disable-next-line react/sort-comp
	handleMinimize = (event: React.MouseEvent | React.KeyboardEvent) => {
		event.preventDefault();

		this.windowCoordinatesState.widthBeforeAction = this.width;
		this.windowCoordinatesState.heightBeforeAction = this.height;
		this.windowCoordinatesState.topBeforeAction = this.top;
		this.windowCoordinatesState.leftBeforeAction = this.left;

		this.setState({
			stage: windowStage.MINIMIZED,
			height: 0,
		});
		dispatchEvent(this.props.onStageChange, event, this, { state: windowStage.MINIMIZED });
	};

	handleFullscreen = (event: React.MouseEvent | React.KeyboardEvent) => {
		event.preventDefault();

		this.windowCoordinatesState.widthBeforeAction = this.width;
		this.windowCoordinatesState.heightBeforeAction = this.height;
		this.windowCoordinatesState.topBeforeAction = this.top;
		this.windowCoordinatesState.leftBeforeAction = this.left;

		this.setState({
			stage: windowStage.FULLSCREEN,
			width: window.innerWidth,
			height: window.innerHeight,
			top: 0,
			left: 0,
		});
		dispatchEvent(this.props.onStageChange, event, this, { state: windowStage.FULLSCREEN });
	};

	handleRestore = (event: React.MouseEvent | React.KeyboardEvent) => {
		event.preventDefault();

		if (this.windowStage === windowStage.MINIMIZED) {
			this.setState({
				stage: windowStage.DEFAULT,
				height: this.windowCoordinatesState.heightBeforeAction,
			});
		} else if (this.windowStage === windowStage.FULLSCREEN) {
			this.setState({
				stage: windowStage.DEFAULT,
				width: this.windowCoordinatesState.widthBeforeAction,
				height: this.windowCoordinatesState.heightBeforeAction,
				top: this.windowCoordinatesState.topBeforeAction,
				left: this.windowCoordinatesState.leftBeforeAction,
			});
		}

		dispatchEvent(this.props.onStageChange, event, this, { state: windowStage.DEFAULT });
	};

	onHandleMaskClick = (event: React.MouseEvent) => {
		const { maskClosable = true } = this.props;
		if (maskClosable) {
			this.handleCloseWindow(event);
		}
	};

	handleCloseWindow = (event: React.MouseEvent | React.KeyboardEvent) => {
		event.preventDefault();
		dispatchEvent(this.props.onCancel, event, this, { state: undefined });
	};

	onHandleOk = (event: React.MouseEvent) => {
		event.preventDefault();
		dispatchEvent(this.props.onOk, event, this, { state: undefined });
	};

	doubleClickStageChange = (event: React.MouseEvent) => {
		const { stageChangeByDoubleClick = true } = this.props;
		if (!stageChangeByDoubleClick) {
			return;
		}

		if (this.windowStage === windowStage.FULLSCREEN || this.windowStage === windowStage.MINIMIZED) {
			this.handleRestore(event);
		} else {
			this.handleFullscreen(event);
		}
	};

	onPress = (data: IDraggableEvent) => {
		const e = data.event;
		this.windowCoordinatesState.differenceTop = e.pageY - this.top;
		this.windowCoordinatesState.differenceLeft = e.pageX - this.left;
	};

	onDrag = (data: IDraggableEvent) => {
		const e = data.event;
		const { draggable = true, onMove } = this.props;

		e.originalEvent.preventDefault();

		if (this.windowStage !== windowStage.FULLSCREEN && draggable) {
			this.setState({
				top: Math.max(e.pageY - this.windowCoordinatesState.differenceTop, 0),
				left: e.pageX - this.windowCoordinatesState.differenceLeft,
				isDragging: true,
			});
			if (onMove) {
				this.dispatchMoveEvent(onMove, e, true, false);
			}
		}
	};

	onRelease = (data: IDraggableEvent) => {
		const e = data.event;
		const { draggable = true, onMove } = this.props;

		if (this.windowStage !== windowStage.FULLSCREEN && draggable) {
			if (onMove) {
				this.dispatchMoveEvent(onMove, e, true, true);
			}
		}

		this.setState({
			isDragging: false,
		});
	};

	onHandleResize = (event: TouchDragEvent | MouseDragEvent, props: { direction: string; end: boolean }) => {
		const currentWidth = this.width;
		const currentHeight = this.height;
		const minWidth = this.props.minWidth || DEFAULT_MIN_WIDTH;
		const minHeight = this.props.minHeight || DEFAULT_MIN_HEIGHT;
		const heightDifference = this.top - event.pageY;
		const widthDifference = this.left - event.pageX;
		const newWidth = event.pageX - this.left;
		const newHeight = event.pageY - this.top;
		const newState = { ...this.state, isDragging: !props.end };
		if (props.direction.indexOf('n') >= 0 && minHeight - (currentHeight + heightDifference) < 0) {
			newState.top = event.pageY;
			newState.height = currentHeight + heightDifference;
		}
		if (props.direction.indexOf('s') >= 0 && minHeight - newHeight < 0) {
			newState.height = newHeight;
		}
		if (props.direction.indexOf('w') >= 0 && minWidth - (currentWidth + widthDifference) < 0) {
			newState.left = event.pageX;
			newState.width = currentWidth + widthDifference;
		}
		if (props.direction.indexOf('e') >= 0 && minWidth - newWidth < 0) {
			newState.width = newWidth;
		}
		this.setState(newState);
		if (this.props.onResize) {
			this.dispatchMoveEvent(this.props.onResize, event, true, props.end);
		}
	};

	getInitialWidth() {
		let width = DEFAULT_WIDTH;
		if (this.props.width !== undefined) {
			width = this.props.width;
		} else if (this.props.initialWidth !== undefined) {
			width = this.props.initialWidth;
		}
		return width;
	}

	getInitialHeight() {
		let height = DEFAULT_HEIGHT;
		if (this.props.height !== undefined) {
			height = this.props.height;
		} else if (this.props.initialHeight !== undefined) {
			height = this.props.initialHeight;
		}
		return height;
	}

	getInitialTop() {
		if (this.props.top !== undefined) {
			return this.props.top;
		}
		if (this.props.initialTop !== undefined) {
			return this.props.initialTop;
		}
		let height = DEFAULT_HEIGHT;
		if (this.props.height !== undefined) {
			height = this.props.height;
		} else if (this.props.initialHeight !== undefined) {
			height = this.props.initialHeight;
		}
		return window.innerHeight / 2 - height / 2;
	}

	getInitialLeft() {
		if (this.props.left !== undefined) {
			return this.props.left;
		}
		if (this.props.initialLeft !== undefined) {
			return this.props.initialLeft;
		}
		let width = DEFAULT_WIDTH;
		if (this.props.width !== undefined) {
			width = this.props.width;
		} else if (this.props.initialWidth !== undefined) {
			width = this.props.initialWidth;
		}
		return window.innerWidth / 2 - width / 2;
	}

	get windowStage() {
		return this.props.stage || this.state.stage;
	}

	get width() {
		let width = this.props.width || this.state.width;

		if (this.windowStage === windowStage.FULLSCREEN) {
			width = window.innerWidth; // @todo 取直接容器宽度
		}

		return width;
	}

	get height() {
		let height = this.props.height || this.state.height;

		if (this.windowStage === windowStage.MINIMIZED) {
			height = 0;
		} else if (this.windowStage === windowStage.FULLSCREEN) {
			height = window.innerHeight; // @todo 取直接容器高度
		}

		return height;
	}

	get top() {
		if (this.windowStage !== windowStage.FULLSCREEN) {
			return Math.max(this.props.top || this.state.top || 0, 0);
		}

		return 0;
	}

	get left() {
		if (this.windowStage !== windowStage.FULLSCREEN) {
			return Math.max(this.props.left || this.state.left || 0, 0);
		}

		return 0;
	}

	render() {
		// 暂时暴力处理。@todo 隐藏保留组件
		if (!this.props.visible) return null;

		const {
			appendContainer,
			theme,
			mask = true,
			maskStyle,
			maskClassName,
			shouldUpdateOnDrag = false,
			draggable = true,
			resizable = true,

			title,
			titleBarClassName,

			style,
			className,
			zIndex = 1000,

			contentClassName,
			children,

			footerClassName,
			showCancel,
			showOk,
			cancelText,
			okText,
		} = this.props;
		const { isDragging } = this.state;

		const Window = (
			<>
				{mask && (
					<div
						style={{ ...maskStyle, zIndex }}
						className={classNames('fy-mask', maskClassName)}
						onClick={this.onHandleMaskClick}
					/>
				)}
				<div
					style={{
						width: this.width,
						height: this.height,
						top: this.top,
						left: this.left,
						zIndex: zIndex + 1,
						...style,
					}}
					className={classNames('fy-window', className, theme, {
						'fy-window-minimized': this.state.stage === 'MINIMIZED',
					})}
					tabIndex={-1}
					onFocus={(e) => e.target.classList.add('fy-state-focused')}
					onBlur={(e) => e.target.classList.remove('fy-state-focused')}
					onKeyDown={this.onHandleKeyDown}
				>
					{/* @ts-ignore */}
					<Optimization shouldUpdateOnDrag={shouldUpdateOnDrag} isDragging={isDragging}>
						<TitleBar
							className={titleBarClassName}
							stage={this.windowStage}
							draggable={draggable}
							onDoubleClick={this.doubleClickStageChange}
							onMinimizeButtonClick={this.handleMinimize}
							onFullScreenButtonClick={this.handleFullscreen}
							onRestoreButtonClick={this.handleRestore}
							onCloseButtonClick={this.handleCloseWindow}
							minimizeButton={this.props.minimizeButton}
							maximizeButton={this.props.maximizeButton}
							restoreButton={this.props.restoreButton}
							closeButton={this.props.closeButton}
							onPress={this.onPress}
							onDrag={this.onDrag}
							onRelease={this.onRelease}
						>
							{title}
						</TitleBar>

						{this.windowStage !== windowStage.MINIMIZED ? (
							<div className={classNames('fy-window-content', contentClassName)}>{children}</div>
						) : null}

						{this.windowStage !== windowStage.MINIMIZED && (
							<FooterBar
								className={footerClassName}
								showCancel={showCancel}
								showOk={showOk}
								cancelText={cancelText}
								okText={okText}
								onCancel={this.handleCloseWindow}
								onOk={this.onHandleOk}
							/>
						)}

						{this.windowStage === windowStage.DEFAULT && resizable && (
							<ResizeHandlers onResize={this.onHandleResize} />
						)}
					</Optimization>
				</div>
			</>
		);

		if (!appendContainer) {
			return createPortal(Window, document.body);
		}

		if (appendContainer instanceof HTMLElement) {
			return createPortal(Window, appendContainer);
		}

		return Window;
	}
}
