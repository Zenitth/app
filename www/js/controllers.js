angular.module('starter.controllers', [])

  .controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  })

  /**
   * Login controller
   * @Post form data to API
   *
   */
  .controller('LoginCtrl', function($scope, security) {
    
    $scope.login = {};
    $scope.errors = {};

    $scope.doLogin = function() {
      if(security.email($scope.login.email) && security.password($scope.login.pass)) {
        console.log('wait for login');
        $scope.errors = {};
      } else {
        $scope.errors = {'error': 'Email ou mot de passe invalide.'};
      }
    };

  })

  /**
   * Register controller
   * @Post form data to API
   *
   */
  .controller('RegisterCtrl', function($scope, $stateParams, $http, $state, security, serialize) {

    var verifiedDatas = ['username', 'email', 'password', 'password_confirm', 'birthday', 'sex'];
    $scope.register = {};

    $scope.doRegister = function() {

      if (
            security.notEmpty($scope.register, verifiedDatas) 
            && security.birthday($scope.register.birthday)
            && security.samePsw($scope.register.password, $scope.register.password_confirm)
        ) {
          
            $http({
              method: 'POST',
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              url: 'http://zenitth.local/app_dev.php/account/registers',
              data: serialize.serializeData($scope.register)
            })
            .success( function (data, status, headers, config) {
              window.localStorage.setItem('token', JSON.stringify(data));
              window.localStorage.setItem('isConnected', true);
              $state.go('app.query');
            })
            .error( function(data, status, headers, config) {
              $scope.error = data;
            });

        }
    }

  })

  /**
   * Query controller
   * @Get each questions related to current user
   *
   */
  .controller('QueryCtrl', function($scope, $stateParams) {
  });
