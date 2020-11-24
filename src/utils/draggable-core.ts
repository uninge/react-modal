export interface IDraggableCoreTouchDragEvent {
	pageX: number;
	pageY: number;
	clientX: number;
	clientY: number;
	type: string;
	originalEvent: TouchEvent;
	isTouch: boolean;
}

export interface IDraggableCoreMouseDragEvent {
	pageX: number;
	pageY: number;
	clientX: number;
	clientY: number;
	type: string;
	originalEvent: MouseEvent;
	isTouch: boolean;

	offsetX: number;
	offsetY: number;
	ctrlKey: boolean;
	shiftKey: boolean;
	altKey: boolean;
}

export interface IDraggableCore {
	press?: (event: IDraggableCoreTouchDragEvent | IDraggableCoreMouseDragEvent) => void;
	drag?: (event: IDraggableCoreTouchDragEvent | IDraggableCoreMouseDragEvent) => void;
	release?: (event: IDraggableCoreTouchDragEvent | IDraggableCoreMouseDragEvent) => void;
	mouseOnly?: boolean;
}

const proxy = (
	a: { (e: MouseEvent & TouchEvent): IDraggableCoreTouchDragEvent | IDraggableCoreMouseDragEvent; },
	b: { (arg0: any): void; },
) => {
	return (e: any) => b(a(e));
};

const noop = () => {/* empty */};

const preventDefault = (event: MouseEvent | TouchEvent) => event.preventDefault();

const touchRegExp = /touch/;

// 300ms is the usual mouse interval.
// However, an underpowered mobile device under a heavy load may queue mouse events for a longer period.
const IGNORE_MOUSE_TIMEOUT = 2000;

function normalizeTouchEvent(e: TouchEvent) {
	return {
		pageX: e.changedTouches[0].pageX,
		pageY: e.changedTouches[0].pageY,
		clientX: e.changedTouches[0].clientX,
		clientY: e.changedTouches[0].clientY,
		type: e.type,
		originalEvent: e,
		isTouch: true,
	};
}

function normalizeMouseEvent(e: MouseEvent) {
	return {
		pageX: e.pageX,
		pageY: e.pageY,
		clientX: e.clientX,
		clientY: e.clientY,
		type: e.type,
		originalEvent: e,
		isTouch: false,

		offsetX: e.offsetX,
		offsetY: e.offsetY,
		ctrlKey: e.ctrlKey,
		shiftKey: e.shiftKey,
		altKey: e.altKey,
	};
}

function normalizeEvent(e: MouseEvent & TouchEvent) {
	if (e.type.match(touchRegExp)) {
		return normalizeTouchEvent(e);
	}

	return normalizeMouseEvent(e);
}

export default class DraggableCore {
	private element: null | HTMLElement;
	private ignoreMouse: boolean;
	private mouseOnly: boolean;
	private pressHandler: (e: MouseEvent | TouchEvent) => any;
	private dragHandler: (e: MouseEvent | TouchEvent) => any;
	private releaseHandler: (e: MouseEvent | TouchEvent) => any;
	private readonly mousedown: (e: MouseEvent) => void;
	private readonly mousemove: (e: MouseEvent) => void;
	private readonly mouseup: (e: MouseEvent) => void;
	private readonly restoreMouse: () => void;
	private readonly touchstart: (e: TouchEvent) => void;
	private readonly touchmove: (e: TouchEvent) => void;
	private readonly touchend: (e: TouchEvent) => void;
	private readonly pointerdown: (e: PointerEvent) => void;
	private readonly pointermove: (e: PointerEvent) => void;
	private readonly pointerup: (e: PointerEvent) => void;

	static supportPointerEvent() {
		return typeof window !== 'undefined' && window.PointerEvent;
	}

	constructor(props: Readonly<IDraggableCore>) {
		this.element = null;
		const {
			press = noop,
			drag = noop,
			release = noop,
			mouseOnly = false,
		} = props;
		this.pressHandler = proxy(normalizeEvent, press);
		this.dragHandler = proxy(normalizeEvent, drag);
		this.releaseHandler = proxy(normalizeEvent, release);
		this.ignoreMouse = false;
		this.mouseOnly = mouseOnly;

		this.touchstart = (e: TouchEvent) => {
			if (e.touches.length === 1) {
				this.pressHandler(e);
			}
		};

		this.touchmove = e => {
			if (e.touches.length === 1) {
				this.dragHandler(e);
			}
		};

		this.touchend = (e: TouchEvent) => {
			// the last finger has been lifted, and the user is not doing gesture.
			// there might be a better way to handle this.
			if (e.touches.length === 0 && e.changedTouches.length === 1) {
				this.releaseHandler(e);
				this.ignoreMouse = true;
				setTimeout(this.restoreMouse, IGNORE_MOUSE_TIMEOUT);
			}
		};

		this.restoreMouse = () => {
			this.ignoreMouse = false;
		};

		this.mousedown = (e: MouseEvent) => {
			const { which } = e;

			if ((which && which > 1) || this.ignoreMouse) {
				return;
			}

			document.addEventListener('mousemove', this.mousemove);
			document.addEventListener('mouseup', this.mouseup);
			this.pressHandler(e);
		};

		this.mousemove = (e: MouseEvent) => {
			this.dragHandler(e);
		};

		this.mouseup = (e: MouseEvent) => {
			document.removeEventListener('mousemove', this.mousemove);
			document.removeEventListener('mouseup', this.mouseup);
			this.releaseHandler(e);
		};

		this.pointerdown = (e: PointerEvent) => {
			if (e.isPrimary && e.button === 0) {
				document.addEventListener('pointermove', this.pointermove);
				document.addEventListener('pointerup', this.pointerup);
				document.addEventListener('pointercancel', this.pointerup);
				document.addEventListener('contextmenu', preventDefault);

				this.pressHandler(e);
			}
		};

		this.pointermove = (e: PointerEvent) => {
			if (e.isPrimary) {
				this.dragHandler(e);
			}
		};

		this.pointerup = (e: PointerEvent) => {
			if (e.isPrimary) {
				document.removeEventListener('pointermove', this.pointermove);
				document.removeEventListener('pointerup', this.pointerup);
				document.removeEventListener('pointercancel', this.pointerup);
				document.removeEventListener('contextmenu', preventDefault);

				this.releaseHandler(e);
			}
		};
	}

	bindTo(element: HTMLElement) {
		if (element === this.element) {
			return;
		}

		if (this.element) {
			this.unbindFromCurrent();
		}

		this.element = element;
		this.bindToCurrent();
	}

	bindToCurrent() {
		const element = this.element;

		if (!element) return;

		if (this.usePointers()) {
			element.addEventListener('pointerdown', this.pointerdown);
			return;
		}

		element.addEventListener('mousedown', this.mousedown);

		if (!this.mouseOnly) {
			element.addEventListener('touchstart', this.touchstart);
			element.addEventListener('touchmove', this.touchmove);
			element.addEventListener('touchend', this.touchend);
		}
	}

	unbindFromCurrent() {
		const element = this.element;

		if (!element) return;

		if (this.usePointers()) {
			element.removeEventListener('pointerdown', this.pointerdown);
			element.removeEventListener('pointermove', this.pointermove);
			element.removeEventListener('pointerup', this.pointerup);
			element.removeEventListener('contextmenu', preventDefault);
			element.removeEventListener('pointercancel', this.pointerup);
			return;
		}

		element.removeEventListener('mousedown', this.mousedown);

		if (!this.mouseOnly) {
			element.removeEventListener('touchstart', this.touchstart);
			element.removeEventListener('touchmove', this.touchmove);
			element.removeEventListener('touchend', this.touchend);
		}
	}

	usePointers() {
		return !this.mouseOnly && DraggableCore.supportPointerEvent();
	}

	update(props: IDraggableCore) {
		const { press = noop, drag = noop, release = noop, mouseOnly = false } = props;
		this.pressHandler = proxy(normalizeEvent, press);
		this.dragHandler = proxy(normalizeEvent, drag);
		this.releaseHandler = proxy(normalizeEvent, release);
		this.mouseOnly = mouseOnly;
	}

	destroy() {
		this.unbindFromCurrent();
		this.element = null;
	}
}
