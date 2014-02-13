/**
 * Viewport relative units made easy.
 * https://github.com/joaocunha/v-unit/
 *
 * @author João Cunha - joao@joaocunha.net
 * @license MIT
 */

;(function(win, doc) {
    'use strict';

    var VUnit = {
        settings: {
            // The ID for the appended stylesheet
            stylesheetId: 'v-unit-sheet',
            // The interval between each check in miliseconds
            executionInterval: 100
        },

        // Stores the viewport dimensions in an accessible scope
        viewportSize: {
            height: 0,
            width: 0
        },

        init: function() {
            // Initial call to prevent FOUC
            VUnit.viewportHasChanged();

            // Starts the observer
            VUnit.setViewportObserver();
        },

        // The observer is necessary for two main reasons: window resizing and scrollbars
        setViewportObserver: function() {
            return win.setInterval(VUnit.viewportHasChanged, VUnit.settings.executionInterval);
        },

        // Checks if viewport dimensions have changed
        viewportHasChanged: function() {
            var oldHeight = VUnit.viewportSize.height,
                oldWidth = VUnit.viewportSize.width,
                newDimensions = VUnit.viewportCalculator();

            // the viewport size changed, lets update
            if (newDimensions.height != oldHeight || newDimensions.width != oldWidth) {
                // updates the CSS
                VUnit.generalHandler();
            }
        },

        // Creates a stylesheet object that will hold the rules
        createStylesheet: function() {
            var stylesheet = doc.createElement('style');
            stylesheet.rel = 'stylesheet';
            stylesheet.type = 'text/css';
            stylesheet.id = VUnit.settings.stylesheetId;

            return stylesheet;
        },

        // Creates 100 CSS rules for each v-width and v-height,
        // ranging from 1% to 100% of the viewport (in px)
        setStylesheetCSSRules: function(stylesheet) {
            var viewportSize = VUnit.viewportCalculator();

            var computedHeight = (viewportSize.height / 100),
                computedWidth = (viewportSize.width / 100),
                rules = '';

            // adds rules from vh1/vw1 to vh100/vw100 to the stylesheet
            for (var i = 1; i <= 100; i++) {
                rules += '.vh' + i + '{height:' + Math.round(computedHeight * i) + 'px;}' +
                         '.vw' + i + '{width:'  + Math.round(computedWidth * i)  + 'px;}\n';
            }

            // IE < 8 checking
            if (stylesheet.styleSheet) {
                stylesheet.styleSheet.cssText = rules;
            } else {
                stylesheet.appendChild(doc.createTextNode(rules));
            }
        },

        // Appends the stylesheet on the head tag
        appendStylesheetOnHead: function(stylesheet) {
            var legacyStylesheet = doc.getElementById(VUnit.settings.stylesheetId),
                // borrowed head detection from restyle.js
                head = doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement;

            (legacyStylesheet) && head.removeChild(legacyStylesheet);

            head.appendChild(stylesheet);
        },

        // Calculates the dimensions of the viewport and saves them globally
        viewportCalculator: function() {
            // Object to be returned
            var viewportSize = {
                height: doc.documentElement.clientHeight,
                width: doc.documentElement.clientWidth
            };

            // Updates the global variable for future checking
            VUnit.viewportSize = viewportSize;

            return viewportSize;
        },

        // Just an invoker, puts the logic altogether
        generalHandler: function() {
            var stylesheet = VUnit.createStylesheet();
            VUnit.setStylesheetCSSRules(stylesheet);
            VUnit.appendStylesheetOnHead(stylesheet);
        }
    };

    VUnit.init();
})(window, document);
