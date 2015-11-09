'use strict';

/**
 * Angular.js plugin
 *
 * Provides an $exceptionHandler for Angular.js
 */

var Raven = require('../src/raven');

function RavenProvider() {
    this.$get = ['$window', function($window, $log) {
        return $window.Raven;
    }];
}

function ExceptionHandlerProvider($provide) {
    $provide.decorator('$exceptionHandler',
        ['Raven', '$delegate', exceptionHandler]);
}

function exceptionHandler(Raven, $delegate) {
    return function (ex, cause)     {
        Raven.captureException(ex, {
            extra: { cause: cause }
        });
        $delegate(ex, cause);
    };
}

function install() {
    var angular = window.angular;
    if (!angular) return;

    angular.module('ngRaven', [])
        .provider('Raven',  RavenProvider)
        .config(['$provide', ExceptionHandlerProvider]);
}

module.exports = {
    install: install
};