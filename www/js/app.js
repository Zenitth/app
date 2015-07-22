// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform, $rootScope, $state, $http, $ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.hide();
    }
  });

  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    
    if (toState.authenticate) {
      // If connected
      if (window.localStorage.getItem('isConnected')) {
        token = JSON.parse(window.localStorage.getItem('token'));

        // If accessToken
        if (null !== window.localStorage.getItem('accessToken')) {

          accessToken = JSON.parse(window.localStorage.getItem('accessToken'));
          expire = accessToken.expire;

          // if date is expired
          if (expire < Date.now()) {

            // refresh token
            expire = new Date().getTime() + (3600*1000);
            getter = "http://zenitth.com/oauth/v2/token?client_id=" + token.clientId + "&client_secret=" + token.secretId + "&grant_type=refresh_token&refresh_token=" + accessToken.refreshToken;
            $http.get(getter).success( function(data, status, headers, config) {
              accessTokens = angular.toJson({
                'token': data.access_token, 
                'refreshToken': data.refresh_token, 
                'expire': expire
              });

              window.localStorage.setItem('accessToken', accessTokens);
              $state.go(toState.name);

            });

            console.log(toState.name);
          } else {
            return true;
          }
        } else {

          // Get access token
          expire = new Date().getTime() + (3600*1000);
          getter = "http://zenitth.com/oauth/v2/token?grant_type=http://zenitth.com/grants/api_key&client_id=" + 
          token.clientId + "&client_secret=" + token.secretId + "&api_key=" + token.key;

          $http.get(getter).success( function(data, status, headers, config) {
            accessToken = angular.toJson({
              'token': data.access_token, 
              'refreshToken': data.refresh_token, 
              'expire': expire
            });

            window.localStorage.setItem('accessToken', accessToken);
            $state.go(toState.name);
          });

        }
      } else {
        $state.go("app.login");
      }
      event.preventDefault(); 
    }
     
  });

  $rootScope.$on('loading:show', function() {
    $ionicLoading.show({template: '<ion-spinner class="spinner-calm"></ion-spinner>'})
  });

  $rootScope.$on('loading:hide', function() {
    $ionicLoading.hide()
  });

})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

   $httpProvider.interceptors.push(function($rootScope) {
    return {
      request: function(config) {
        $rootScope.$broadcast('loading:show')
        return config
      },
      response: function(response) {
        $rootScope.$broadcast('loading:hide')
        return response
      }
    }
  });



  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.login', {
    url: "/login",
    views: {
      'menuContent': {
        templateUrl: "templates/login.html",
        controller: 'LoginCtrl'
      }
    }
  })

  .state('app.register', {
    url: "/register",
    views: {
      'menuContent': {
        templateUrl: "templates/register.html",
        controller: 'RegisterCtrl'
      }
    }
  })

  .state('app.query', {
    url: "/query",
    authenticate: true,
    views: {
      'menuContent': {
        templateUrl: "templates/query.html",
        controller: 'QueryCtrl'
      }
    }
  })

  .state('app.dashboard', {
    url: "/dashboard",
    authenticate: true,
    views: {
      'menuContent': {
        templateUrl: "templates/dashboard.html",
        controller: 'DashboardCtrl'
      }
    }
  })

  .state('app.defi', {
    url: "/defi",
    authenticate: true,
    views: {
      'menuContent': {
        templateUrl: "templates/defi.html",
        controller: 'DefiCtrl'
      }
    }
  })

  .state('app.defivalidation', {
    url: "/defivalidate",
    authenticate: true,
    views: {
      'menuContent': {
        templateUrl: "templates/defi-validation.html",
      }
    }
  })

  .state('app.notifications', {
    url: "/notifications",
    authenticate: true,
    views: {
      'menuContent': {
        templateUrl: "templates/notifications.html",
        controller: 'NotificationsCtrl'
      }
    }
  })

  .state('app.defirequest', {
    url: "/defilaunch/:id",
    authenticate: true,
    views: {
      'menuContent': {
        templateUrl: "templates/request-defi.html",
        controller: 'DefirequestCtrl'
      }
    }
  })

  .state('app.defiquestion', {
    url: "/defi/question/:id",
    authenticate: true,
    views: {
      'menuContent': {
        templateUrl: "templates/defi-question.html",
        controller: 'DefiquestionCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dashboard');
});
