// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $rootScope, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    
    if (toState.authenticate) {
      if (null !== window.localStorage.getItem('isConnected')) {
        token = JSON.parse(window.localStorage.getItem('token'));
        expire = token.expire;

        if (expire < Date.now()) {
          console.log(toState.name);
        } else {
          $state.go(toState.name);
        }
      } else {
        $state.go("app.login");
      }
      event.preventDefault(); 
    }

    if (toState.authenticate) {
      
    }
     
  });

})

.config(function($stateProvider, $urlRouterProvider) {
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

  .state('app.playlists', {
    url: "/playlists",
    authenticate: true,
    views: {
      'menuContent': {
        templateUrl: "templates/playlists.html",
        controller: 'PlaylistsCtrl'
      }
    }
  })

  .state('app.single', {
    url: "/playlists/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/');
});
