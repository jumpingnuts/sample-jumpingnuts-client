'use strict';

var INTERVAL_DELAY = 1500;

angular.module('directives', [])
  //스크롤 이벤트 바인딩
  .directive('ngScrollEvent', ['$parse', '$window', '$document', function($parse, $window, $document) {
    return function(scope, element, attr) {
      var fn = $parse(attr.ngScrollEvent);
      
      var $win = $($window);
      var $doc = $($document);
      
      var interval,
      handler,
      scrollEvent = 'scroll';
      
      var bindScroll = function() {
        handler = function() {
          if ($doc.scrollTop() > ($doc.height()*0.9) - $win.height()) {
            scrollTrigger();
          }
        };

        $win.bind(scrollEvent, handler);
      };

      var startInterval = function() {
        interval = $window.setInterval(function() {
          $window.clearInterval(interval);
          bindScroll();
        }, INTERVAL_DELAY);
      };

      var unbindScroll = function() {
        // be nice to others, don't unbind their scroll handlers
        $win.unbind(scrollEvent);
      };

      var scrollTrigger = function() {
        unbindScroll();
        startInterval(event);
        scope.$apply(fn(scope, {}));
      };

      bindScroll();
    };
  }]);