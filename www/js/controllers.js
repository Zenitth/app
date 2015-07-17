angular.module('starter.controllers', [])

  .controller('AppCtrl', function($scope, $ionicModal, $timeout) {
    console.log('appCTRL');
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
              url: 'http://zenitth.com/app_dev.php/account/logins',
              data: serialize.serializeData($scope.login)
            })
            .success( function (data, status, headers, config) {
              window.localStorage.setItem('token', JSON.stringify(data));
              window.localStorage.setItem('isConnected', true);
              $state.go('app.dashboard');
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
        url: 'http://zenitth.com/app_dev.php/account/brands'
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
              url: 'http://zenitth.com/app_dev.php/account/registers',
              data: serialize.serializeData($scope.register)
            })
            .success( function (data, status, headers, config) {
              window.localStorage.setItem('token', JSON.stringify(data));
              window.localStorage.setItem('isConnected', true);
              $state.go('app.dashboard');
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
  .controller('QueryCtrl', function($scope, $stateParams, $timeout, $state, $http, $ionicPopup, $ionicHistory, serialize) {

    $scope.currentId = 0;
    $scope.currentPts = 0;
    $scope.questions = {};
    $scope.currentQuestion = {};
    $scope.answerStatus = "";
    $scope.timerStyle = {};
    $scope.selectedResponse = "";
    $scope.selectedIndex = -1;
    $scope.isWin = -1;
    $scope.end = false;

    access_token = JSON.parse(window.localStorage.getItem('accessToken')).token;
    $http({
      method: 'GET',
      url: 'http://zenitth.com/app_dev.php/api/quizz?access_token=' + access_token,
    })
    .success( function (data, status, headers, config) {
      $scope.questions = data.questions;
      $scope.user = data.user[0];
      $scope.launch();
    })
    .error( function(data, status, headers, config) {
      $scope.error = data;
    });

    $scope.launch = function() {
      $scope.isWin = -1;
      console.log($scope.questions[$scope.currentId]);
      $scope.currentQuestion = $scope.questions[$scope.currentId];
      $scope.timerStart();
    }

    $scope.timerStart = function() {
      $scope.timerStyle = {'width' : '100%'};
      timer = $timeout( function() {
        if ($scope.selectedResponse.is_true) {
          console.log('win');
          $scope.currentPts = $scope.currentPts + 5;
          $scope.user.score = $scope.user.score +5;
          $scope.isWin = true;
        } else {
          console.log('loose');
          $scope.isWin = false;
        }
        $scope.timerStyle = {'webkitAnimationPlayState' : 'initial', 'transition-duration' : '0s'};
      }, 5000);
    }

    $scope.valid = function(a, index) {
      $scope.selectedResponse = a;
      $scope.selectedIndex = index;
    }

    $scope.done = function() {
      $scope.end = true;
    };

    $scope.finish = function() {
      access_token = JSON.parse(window.localStorage.getItem('accessToken')).token;
      $http({
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: 'http://zenitth.com/app_dev.php/api/scores?access_token=' + access_token,
        data: serialize.serializeData({'score' : $scope.currentPts })
      })
      .success( function (data, status, headers, config) {
        $ionicHistory.nextViewOptions({
          disableAnimate: true,
          disableBack: true
        });
        $state.go('app.dashboard');
      })
      .error( function(data, status, headers, config) {
        $scope.error = data;
      });
    } 

    $scope.next = function() {
      $scope.currentId++;
      console.log($scope.currentId);
      $scope.selectedIndex = -1;
      $scope.selectedResponse = "";
      
      if ($scope.currentId < $scope.questions.length) {
        $scope.launch();
      } else {
        $scope.done();
      }
    };

  })


  /**
   * Dashboard Controller
   * @Get information related to current user and his brand
   *
   */
  .controller('DashboardCtrl', function($scope, $stateParams, $state, $http) {

    $scope.dashboard = {};
    access_token = JSON.parse(window.localStorage.getItem('accessToken')).token;
    $http({
      method: 'GET',
      url: 'http://zenitth.com/app_dev.php/api/dashboard?access_token=' + access_token,
    })
    .success( function (data, status, headers, config) {
     $scope.dashboard = data;
     console.log($scope.dashboard);
    })
    .error( function(data, status, headers, config) {
      $scope.error = data;
    });

  })


  /**
   * Defi Controller
   * @Get Defi
   *
   */
  .controller('DefiCtrl', function($scope, $stateParams, $state, $http, serialize) {

    $scope.defi = {};
    $scope.selected = "";

    access_token = JSON.parse(window.localStorage.getItem('accessToken')).token;
    $http({
      method: 'GET',
      url: 'http://zenitth.com/app_dev.php/api/defi/question?access_token=' + access_token,
    })
    .success( function (data, status, headers, config) {
     $scope.defi = data;
     console.log($scope.defi);
    })
    .error( function(data, status, headers, config) {
      $scope.error = data;
    });


    $scope.validateDefi = function(id) {
      $scope.selected = id;
    }

    $scope.end = function() {
      $http({
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: 'http://zenitth.com/app_dev.php/api/defis/validates?access_token=' + access_token,
        data: serialize.serializeData({'userTo' : $scope.defi.userTo.id, 'question' : $scope.selected })
      })
      .success( function (data, status, headers, config) {
       console.log(data);
       $state.go('app.defivalidation');
      })
      .error( function(data, status, headers, config) {
        $scope.error = data;
      });
    }

  })

  /**
   * Notification controller
   * @Get all user's notifications
   *
   */
  .controller('NotificationsCtrl', function($scope, $http, $state, security, serialize) {
    
    access_token = JSON.parse(window.localStorage.getItem('accessToken')).token;
    $http({
      method: 'GET',
      url: 'http://zenitth.com/app_dev.php/api/notifications?access_token=' + access_token,
    })
    .success( function (data, status, headers, config) {
     $scope.notifications = data;
     console.log($scope.notifications);
    })
    .error( function(data, status, headers, config) {
      $scope.error = data;
    });

    $scope.getMoment = function(time) {
      return moment(time).fromNow()
    }
  })

  /**
   * Request Defi controller
   * @Get ID Defi
   *
   */
  .controller('DefirequestCtrl', function($scope, $stateParams, $http, $state, security, serialize, shareDataService) {
    id = $stateParams.id;

    access_token = JSON.parse(window.localStorage.getItem('accessToken')).token;
    $http({
      method: 'GET',
      url: 'http://zenitth.com/app_dev.php/api/defis/' + id + '?access_token=' + access_token,
    })
    .success( function (data, status, headers, config) {
     $scope.defi = data;
     shareDataService.selectedDefi = data;
     console.log($scope.defi);
    })
    .error( function(data, status, headers, config) {
      $scope.error = data;
    });
  })

  /**
   * Question defi
   * @Get Defi question
   */
  .controller('DefiquestionCtrl', function($scope, $stateParams, $http, $state, $timeout, $interval, security, serialize, shareDataService) {
    id = $stateParams.id;
    // $scope.defi = shareDataService.selectedDefi;
    $scope.selectedIndex = -1;
    $scope.time = 0;
    $scope.timerStyle = {'width' : '0%'};
    $scope.selectedResponse = {};
    $scope.pts = -15;
    $scope.win = "";
    access_token = JSON.parse(window.localStorage.getItem('accessToken')).token;

    $scope.valid = function(a, index) {
      $scope.selectedResponse = a;
      $scope.selectedIndex = index;
      if (a.is_true) {
        $scope.pts = 15;
      }
    }

    $scope.timerStart = function() {
      $scope.timerStyle = {'width' : '100%'};
      timer = $timeout( function() {
        $scope.response();
        $interval.cancel(interval);
      }, 6000);
      interval = $interval(function() {
        $scope.time++;
      }, 1000);
    }

    $scope.response = function() {
      if ($scope.selectedIndex !== -1 && $scope.selectedResponse.is_true) {
        data = {
                  'defi'      : $scope.defi.id,
                  'response'  : $scope.selectedResponse.id,
                  'pts'       : 15
               }
      } else {
        data = {
                  'defi'      : $scope.defi.id,
                  'response'  : 0,
                  'pts'       : $scope.pts
               }
      }

      $http({
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: 'http://zenitth.com/app_dev.php/api/responses/defis?access_token=' + access_token,
        data: serialize.serializeData(data)
      })
      .success( function (data, status, headers, config) {
        if ($scope.pts == 15) {
          $scope.win = "win";
        } else {
          $scope.win = "loose";
        }
        console.log($scope.win);
      })
      .error( function(data, status, headers, config) {
        $scope.error = data;
      });
    }

    $scope.defi = {};
    $http({
      method: 'GET',
      url: 'http://zenitth.com/app_dev.php/api/defis/' + id + '?access_token=' + access_token,
    })
    .success( function (data, status, headers, config) {
      $scope.defi = data;
      shareDataService.selectedDefi = data;
      $scope.timerStart();
      console.log($scope.defi);
    })
    .error( function(data, status, headers, config) {
      $scope.error = data;
    });
  });