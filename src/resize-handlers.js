import React from 'react';
import PropTypes from 'prop-types';

import Draggable from './draggable';

import { directions } from './utils/config';

export default function ResizeHandlers(props) {
	const { onResize } = props;
	function onDrag(data, key) {
		const event = data.event;

		event.originalEvent.preventDefault();

		if (onResize) {
			onResize(event, { end: false, direction: key });
		}
	}

	function onRelease(data, key) {
		const event = data.event;

		event.originalEvent.preventDefault();

		if (onResize) {
			onResize(event, { end: true, direction: key });
		}
	}

	return (
		<div>
			{directions.map((key, index) => (
				<Draggable
					// eslint-disable-next-line react/no-array-index-key
					key={index}
					onDrag={data => onDrag(data, key)}
					onRelease={data => onRelease(data, key)}
				>
					<div
						style={{ display: 'block', touchAction: 'none' }}
						className={`fy-resize-handle ${key}`}
					/>
				</Draggable>
			))}
		</div>
	);
}

ResizeHandlers.propTypes = {
	onResize: PropTypes.func,
};
