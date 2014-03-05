'use strict';

angular.module('userCtrls', ['userServices', 'nativeServices'])
  .controller('UserCtrl', [
    '$scope',
    '$routeParams',
    'User',
    'Login',
    'Logout',
    function ($scope, $routeParams, User, Login, Logout) {
      $scope.userInfo = {
        isLogin:false,
        connection: []
      };
      $scope.userConnection = {};
      
      $scope.setUserInfo = function(res) {
        $scope.userInfo.isLogin = true;
        $scope.userInfo.id = res.id;
        $scope.userInfo.email = res.email;
      };
      
      $scope.sessLogin = function(){
        if(window.android) {
          window.android.login('window.android.loginCallback');
        } else {
          new User.get({'id':'me'}, function(res) {
            if(res.id) {
              $scope.setUserInfo(res);
              $scope.move( '/list/trends' );
            }
          });
        }
      };
      $scope.sessLogin();
      
      $scope.isLogin = function(){
        return $scope.userInfo.isLogin?true:false;
      };
      
      $scope.logout = function(){
        new Logout.save();
        $scope.userInfo = {};
        $scope.userInfo.isLogin = false;
        $scope.move( '/list/trends' );
      };
      
      $scope.loginAction = function(){
        var opt = {
          'password': $scope.userInfo.password
        };
        new Login($scope.userInfo.email, opt).then(function(res){
          $scope.userInfo.password = '';
          if(res.id) {
            $scope.setUserInfo(res);

            if($.inArray('kakao', $scope.userInfo.connection) > -1) {
              $scope.setKakaoConn();
            }
            $scope.move( $routeParams.redirectUrl || '/list/trends' );
          }
          
        }, function(res){
          if(res.status === 401) {
            $scope.alerts.push({ type: 'danger', msg: '아이디 또는 비밀번호가 틀립니다.' });
          }
        });
      };
      
      $scope.setKakaoConn = function(){
        new User.get({'id':$scope.userInfo.id, 'action':'connection'}, function(res){
          if(res.key) {
            window.android.setUserInfo('uid', $scope.userInfo.id);
            window.android.setUserInfo('key', res.key);
          } else {
            new User.save({
              'connectionProvider':'kakao',
              'connectionProfile':window.android.getUserInfo(),
              'action':'connection'
            }, function(){
              new User.get({'id':$scope.userInfo.id, 'action':'connection'}, function(res){
                window.android.setUserInfo('uid', $scope.userInfo.id);
                window.android.setUserInfo('key', res.key);
              });
            });
          }
        });
      };
      
      $scope.moveLogin = function(){
        $scope.move('/login?redirectUrl='+$scope.appInfo.currentPath);
      };
    }
  ])
  .controller('LoginCtrl', ['$scope', function($scope){
    if($scope.userInfo.id) {
      $scope.move( '/list/trends' );
    }
  }])
  .controller('RegistCtrl', ['$scope', 'UserRegist', function($scope, UserRegist){
    if($scope.userInfo.id) {
      $scope.move( '/list/trends' );
    }
    $scope.regist = {};

    $scope.userRegist = function(){
      new UserRegist($scope.regist).then(function(res){
        if(res.id) {
          $scope.userInfo.email = $scope.regist.email;
          $scope.userInfo.password = $scope.regist.password;
          $scope.loginAction();
        }
      }, function(res){
        $scope.alerts.push({ type: 'danger', msg: res.data.message });
      });
    };
  }]);
