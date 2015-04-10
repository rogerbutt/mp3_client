// var demoApp = angular.module('demoApp', ['demoControllers']);

var demoApp = angular.module('demoApp', ['ngRoute', '720kb.datepicker', 'demoControllers', 'demoServices']);

demoApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/usersview', {
    templateUrl: 'partials/usersview.html',
    controller: 'UsersController'
  }).
  when('/adduserview', {
    templateUrl: 'partials/adduserview.html',
    controller: 'AddUserController'
  }).
  when('/tasksview', {
    templateUrl: 'partials/tasksview.html',
    controller: 'TasksController'
  }).
  when('/newtaskview', {
    templateUrl: 'partials/newtaskview.html',
    controller: 'NewTaskController'
  }).
  when('/taskdetailview/:id', {
    templateUrl: 'partials/taskdetailview.html',
    controller: 'TaskDetailController'
  }).
  when('/edittaskview/:id', {
    templateUrl: 'partials/edittaskview.html',
    controller: 'EditTaskController'
  }).
  when('/usersview/:id', {
    templateUrl: 'partials/userdetailview.html',
    controller: 'UserDetailController'
  }).
  when('/settings', {
    templateUrl: 'partials/settings.html',
    controller: 'SettingsController'
  }).
  otherwise({
    redirectTo: '/settings'
  });
}]);
