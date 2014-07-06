/**
 * @license ngScroll.js v1.0.0
 * (c) 2014 Daniel Smith http://www.danmasta.com
 * License: MIT
 */
(function(window, angular, undefined) { 'use strict';

/**
 * @name ngScroll
 * @description
 *
 * # ngScroll
 *
 * The ngScroll module provides an angular directive for handling scroll events.
 * Expressions are parsed when the document scrolls.
 * Directive implementation is the same as default angular event handlers.
 * Event object is available as $event.
 */

// define ngScroll module
var ngScroll = angular.module('ngScroll', []);

// Factory for checking and binding scroll event to document.
// Broadcasts 'scroll' event from $rootScope to be inherited by all child scopes
ngScroll.factory('scroll', ['$window', '$document', '$rootScope', '$interval', function($window, $document, $rootScope, $interval) {
  function Scroll(event) {
    this.prev = $rootScope.prevScroll || false,
    this.x = $window.pageXOffset !== undefined ? $window.pageXOffset : ($document[0].documentElement || $document[0].body.parentNode || $document[0].body).scrollLeft,
    this.y = $window.pageYOffset !== undefined ? $window.pageYOffset : ($document[0].documentElement || $document[0].body.parentNode || $document[0].body).scrollTop,
    this.type = event.type || event.name,
    this.timestamp = event.timeStamp || Date.now(),
    this.timelapse = this.prev ? this.timestamp - this.prev.timestamp : 0,
    this.distanceX = this.x - (this.prev ? this.prev.x : 0),
    this.distanceY = this.y - (this.prev ? this.prev.y : 0),
    this.velocityX = this.distanceX / (this.timestamp - (this.prev ? this.prev.timestamp : 0)),
    this.velocityY = this.distanceY / (this.timestamp - (this.prev ? this.prev.timestamp : 0)),
    this.directionX = this.distanceX < 0 ? 'left' : this.distanceX > 0 ? 'right' : false,
    this.directionY = this.distanceY < 0 ? 'up' : this.distanceY > 0 ? 'down' : false,
    this.scrollHeight = ($document[0].body.scrollHeight || $document[0].documentElement.scrollHeight) - $window.innerHeight,
    this.event = event || false;
  };
  return {
    get: function(event) {
      return new Scroll(event);
    },
    setDate: function() {
      if (!Date.now) {
        Date.now = function() {
          return new Date().getTime();
        };
      };
      return;
    },
    checkBind: function() {
      if (angular.isUndefined($rootScope.catchScroll)) return false;
      return $rootScope.catchScroll;
    },
    setBind: function() {
      var _this = this;
      var scrollThrottle = 30;
      var didScroll = false;
      var timer = false;
      $document.on('scroll', function(event) {
        if (!didScroll) {
          timer = $interval(function() {
            if (didScroll) {
              didScroll = false;
              $interval.cancel(timer);
              var data = _this.get(event);
              $rootScope.$broadcast('scroll', data);
              $rootScope.prevScroll = data;
            }
          }, scrollThrottle);
        }
        didScroll = true;
      });
      $rootScope.catchScroll = true;
    },
    bind: function(){
      if (!this.checkBind()) {
        this.setDate();
        this.setBind();
        return;
      }
    }
  };
}]);

// ngScroll directive uses throttled scroll event bound to document.
// Usage: ng-scroll="expression()"
// Event data is available as $event
ngScroll.directive('ngScroll', ['$parse', 'scroll', function($parse, scroll) {
  return {
    compile: function($element, attr) {
      var fn = $parse(attr['ngScroll']);
      return function(scope, element, attr) {
        scroll.bind();
        scope.$on('scroll', function(event, data) {
          fn(scope, { $event: data });
        });
      };
    }
  };
}]);

})(window, window.angular);
