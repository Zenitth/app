angular.module('starter.controllers', [])

  .controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  })

  /**
   * Login controller
   * @Post form data to API
   *
   */
  .controller('LoginCtrl', function($scope, $http, $state, $cordovaOauth, security, serialize) {
    
    $scope.login = {};
    $scope.errors = {};

    $scope.doLogin = function() {
      console.log($scope.login);
      if(security.email($scope.login.email) && security.password($scope.login.password)) {
        
        $http({
              method: 'POST',
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              url: 'http://zenitth.local/app_dev.php/account/logins',
              data: serialize.serializeData($scope.login)
            })
            .success( function (data, status, headers, config) {
              window.localStorage.setItem('token', JSON.stringify(data));
              window.localStorage.setItem('isConnected', true);
              $state.go('app.query');
            })
            .error( function(data, status, headers, config) {
              $scope.error = data;
            });
      } else {
        $scope.errors = {'error': 'Email ou mot de passe invalide.'};
      }
    };

    $scope.facebookLogin = function() {
        $cordovaOauth.facebook("640195336116797", ["email"]).then(function(result) {
            console.log(result);
        }, function(error) {
            console.log(error);
        });
    }

  })

  /**
   * Register controller
   * @Post form data to API
   *
   */
  .controller('RegisterCtrl', function($scope, $stateParams, $http, $state, security, serialize) {

    var verifiedDatas = ['username', 'email', 'password', 'password_confirm', 'birthday', 'brand', 'sex'];
    $scope.register = {};
    $scope.brands = {};

    $http({
        method: 'GET',
        url: 'http://zenitth.local/app_dev.php/account/brands'
      })
      .success( function (data, status, headers, config) {
        $scope.brands = data;
      })
      .error( function(data, status, headers, config) {
        $scope.error = data;
      });

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
   * @Get Question related to current user
   *
   */
  .controller('QueryCtrl', function($scope, $stateParams, $state, $http, $ionicPopup, serialize) {

    currentId = 0;
    currentPts = 0;
    $scope.questions = {};
    $scope.currentQuestion = {};
    $scope.answerStatus = "";
    access_token = JSON.parse(window.localStorage.getItem('accessToken')).token;

    $http({
      method: 'GET',
      url: 'http://zenitth.local/app_dev.php/api/quizz?access_token=' + access_token,
    })
    .success( function (data, status, headers, config) {
      $scope.questions = data;
      $scope.launch();
    })
    .error( function(data, status, headers, config) {
      $scope.error = data;
    });

    $scope.launch = function() {
      $scope.currentQuestion = $scope.questions[currentId];
      console.log($scope.questions[currentId]);
    }

    $scope.selectQuestion = function(a) {

      if (a.is_true) {
        $scope.answerStatus = "Bonne réponse !";
        currentPts = currentPts + 5;
      } else {
        $scope.answerStatus = "Mauvaise réponse !";
      }

      
      console.log("Total Pts : " + currentPts);
      currentId++;

      if (currentId < $scope.questions.length) {
        $scope.check();
      } else {
        $scope.done();
      }
    }

    $scope.done = function() {
      var alertPopup = $ionicPopup.alert({
        title: 'Vous avez fini !',
        template: 'Vous avez gagné ' + currentPts + ' Points.'
      });
      alertPopup.then(function(res) {

        access_token = JSON.parse(window.localStorage.getItem('accessToken')).token;
        $http({
          method: 'POST',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          url: 'http://zenitth.local/app_dev.php/api/scores?access_token=' + access_token,
          data: serialize.serializeData({'score' : currentPts })
        })
        .success( function (data, status, headers, config) {
          $state.go('app.dashboard');
        })
        .error( function(data, status, headers, config) {
          $scope.error = data;
        });
      });
    };

    $scope.check = function() {
      var alertPopup = $ionicPopup.alert({
        title: 'Réponse',
        template: $scope.answerStatus
      });
      alertPopup.then(function(res) {
        $scope.launch();
      });
    };

  })


  /**
   * Dashboard Controller
   * @Get information related to current user and his brand
   *
   */
  .controller('DashboardCtrl', function($scope, $stateParams, $state, $http) {

  });