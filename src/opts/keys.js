/*
    String constants
    ----------------------------------------
*/
"use strict";

module.exports = {
    ANIMATE: 'animate',
    CALC: 'calc',
    JQUERY_ELEMENT: '_jQueryElement',
    EASING: {
	    QUAD_IN_OUT: 'quadInOut',
	    QUAD_OUT: 'quadOut',
		IN: 'In',
		IN_OUT: 'InOut',
		OUT: 'Out',
		LINEAR: 'linear'
    },
    LINK: {
	    TIME: 'Time',
	    POINTER: 'Pointer',
	    SPEED: 'Speed'
    },
    ERROR: {
	    ACTION_EXISTS: "Action already defined. Use forceOverride: true to override.",
	    NO_ACTION: "No action defined to inherit from.",
	    INVALID_EASING: ": Easing not defined"
    },
    EVENT: {
	    MOUSE: 'mouse',
        MOUSEDOWN: 'mousedown',
        MOUSEMOVE: 'mousemove',
        MOUSEUP: 'mouseup',
        TOUCH: 'touch',
        TOUCHSTART: 'touchstart',
        TOUCHMOVE: 'touchmove',
        TOUCHEND: 'touchend'
    },
    PROGRESS: {
        DIRECT: 'Direct',
        RANGE: 'Range'
    }
};