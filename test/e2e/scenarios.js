'use strict';

/* E2E 테스트 */

describe('AngularJS 어플리케이션', function() {
console.log('-------------------------start-------------------------');
  
  describe('페이지 접속', function() {
    beforeEach(function() {
      browser().navigateTo('/');
    });
  
    it('특별한 해시값을 지정하지 않을 경우 자동으로 /sample으로 이동', function() {
      expect(browser().window().hash()).toBe("/sample");
    });
    
    it('현재 페이지 타이틀', function() {
      expect(element('[ng-view] h3:first').text()).toMatch(/sample/);
    });
  });
});