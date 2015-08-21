"use strict";

var actionManager = require('../actions/manager'),
    valueTypeManager = require('../value-types/manager'),
    calc = require('../inc/calc'),

    update = function (framestamp, frameDuration) {
        var actor = this,
            values = this.values,
            action = actionManager[this.action],
            valueAction = action,
            state = this.state,
            numActiveValues = this.order.length,
            numActiveParents = this.parentOrder.length,
            numRoles = this.roles.length,
            key = '',
            value = {},
            updatedValue = 0,
            i = 0;

        // Update Input and attach new values to state
        if (this.input) {
            state.input = this.input.onFrame(framestamp);
        }

        // Update Action input
        if (action.onFrameStart && action.onFrameStart.call(this, frameDuration) === false) {
            return false;
        }

        // Fire onStart if first frame
        if (this.firstFrame) {
            for (i = 0; i < numRoles; i++) {
                console.log(this.roles[i]);
                this.roles[i].start.call(actor);
            }
        }

        // Update values
        for (i = 0; i < numActiveValues; i++) {
            // Get value and key
            key = this.order[i];
            value = values[key];

            // Load value-specific action
            valueAction = value.link ? actionManager.link : action;

            // Calculate new value
            updatedValue = valueAction.process.call(this, value, key, frameDuration);

            // Limit if range
            if (valueAction.limit) {
                updatedValue = valueAction.limit(updatedValue, value);
            }

            // Round value if round set to true
            if (value.round) {
                updatedValue = Math.round(updatedValue);
            }

            // Update change from previous frame
            value.frameChange = updatedValue - value.current;

            // Calculate velocity if Action hasn't already
            if (!valueAction.calculatesVelocity) {
                value.velocity = calc.speedPerSecond(value.frameChange, frameDuration);
            }

            // Update current speed
            value.speed = Math.abs(value.velocity);

            // Check if changed and update
            if (value.current != updatedValue) {
                this.hasChanged = true;
            }

            // Set current
            this.values[key].current = updatedValue;

            // Put value in state
            state.values[key] = (value.unit) ? updatedValue + value.unit : updatedValue;

            // Or add to parent state, to be combined
            if (value.parent) {
                state[value.parent] = state[value.parent] || {};
                state[value.parent][value.propName] = state[key];
            }
        }

        // Update parent values from calculated children
        for (i = 0; i < numActiveParents; i++) {
            key = this.parentOrder[i];
            value = this.values[key];

            // Update parent value current property
            value.current = valueTypeManager[value.type].combine(state[key]);

            // Update state
            state[value][value.name] = value.current;
        }

        // Fire `frame` and `update` callbacks
        for (i = 0; i < numRoles; i++) {
            this.roles[i].frame.call(actor, this.state.values);

            if (actor.hasChanged || actor.firstFrame) {
                this.roles[i].update.call(actor, this.state.values);
            }
        }

        // Fire onEnd if this Action has ended
        if (this.isActive && action.hasEnded && action.hasEnded.call(this, this.hasChanged)) {
            this.isActive = false;

            // Fire `complete` callback
            for (i = 0; i < numRoles; i++) {
                this.roles[i].complete.call(actor);
            }

            // If is a play action, and is not active, check next action
            if (!this.isActive && this.action === 'play' && this.next) {
                this.next();
            }
        } else {
            this.hasChanged = false;
        }

        this.firstFrame = false;
        this.framestamp = framestamp;
    };

module.exports = update;