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
   * Query controller
   * @Get each questions related to current user
   *
   */
  .controller('QueryCtrl', function($scope, $stateParams) {
  });
