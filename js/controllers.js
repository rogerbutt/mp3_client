var demoControllers = angular.module('demoControllers', []);

demoControllers.controller('UsersController', ['$scope', 'UsersData', function($scope, UsersData) {
  UsersData.getSparseUsers(function(data, err) {
    $scope.users = data;
    $scope.errorMes = err;
  });

  $scope.deleteUser = function(index, id) {
    UsersData.deleteUser(id, function(data, err) {
      $scope.errorMes = err;
      $scope.users.splice(index, 1);
    });
  }
}]);

demoControllers.controller('AddUserController', ['$scope', 'UsersData', function($scope, UsersData) {
  $scope.displayText = " ";
  $scope.newUser = {};

  $scope.setData = function(){
    UsersData.addUser($scope.newUser, function(data, err) {
      $scope.errorMes = err;
      $scope.displayText = "Data set"
      $scope.newUser = {};
    });
  };

}]);

demoControllers.controller('UserDetailController', ['$scope', 'UsersData', 'TasksData', '$routeParams', function($scope, UsersData, TasksData, $routeParams) {
  $scope.completedTasks = [];

  UsersData.getUser($routeParams.id, function(user, err) {
    $scope.user = user;
    $scope.errorMes = err;

    TasksData.getUserTasks(user._id, function(tasks, err) {
      $scope.errorMes = err;
      $scope.tasks = tasks;
    });
  });

  $scope.loadCompleted = function() {
    TasksData.getCompletedUserTasks($routeParams.id, function(data, err) {
      $scope.completedTasks = data;
      $scope.errorMes = err;
    });
  };

  $scope.completeTask = function(index, id) {
    TasksData.editTask({_id: id, completed: true}, function(data, err) {
      $scope.errorMes = err;
      $scope.tasks.splice(index, 1);
    });
  };
}]);

demoControllers.controller('TasksController', ['$scope', 'TasksData', function($scope, TasksData) {
  $scope.tasks = {};
  $scope.displayText = " ";
  $scope.taskRadioFilter = false;
  $scope.curPage = 0;
  $scope.taskSorter = "";
  $scope.taskOrder = 1;

  $scope.$watchGroup(['taskSorter', 'taskOrder'], function(newValues, oldValues) {

    if(newValues[0].length === 0) {
      TasksData.getTasks(function(data, err) {
        $scope.tasks = data;
        $scope.errorMes = err;
      });
    }
    else {
      TasksData.getSortedTasks(newValues[0], newValues[1], function(data, err) {
        $scope.tasks = data;
        $scope.errorMes = err;
      });
    }
  });

  TasksData.getTasks(function(data, err) {
    $scope.tasks = data;
    $scope.errorMes = err;
  });

  $scope.nextPage = function() {
    if($scope.curPage * 10 >= $scope.tasks.length) return;
    $scope.curPage += 1;
  };

  $scope.prevPage = function() {
    if($scope.curPage === 0) return;
    $scope.curPage -= 1;
  };

  $scope.deleteTask = function(id, index) {
    TasksData.deleteTask(id, function(data, err) {
      $scope.errorMes = err;
      $scope.tasks.splice(index, 1);
    });
  };

}]);

demoControllers.controller('NewTaskController', ['$scope', 'TasksData', 'UsersData', function($scope, TasksData, UsersData) {
  $scope.newTask = {};
  $scope.displayText = " ";
  $scope.users = [];
  $scope.selectedUser = -1;
  $scope.showMissingFields = false;

  UsersData.getSparseUsers(function(data, err) {
    $scope.users = data;
    $scope.errorMes = err;
  });

  $scope.createTask = function() {

    if(!$scope.newTask.name || !$scope.newTask.deadline) {
      $scope.showMissingFields = true;
      return;
    }

    $scope.newTask.completed = false;

    if($scope.selectedUser !== -1) {
      $scope.newTask.assignedUser = $scope.users[$scope.selectedUser]._id;
      $scope.newTask.assignedUserName = $scope.users[$scope.selectedUser].name;
    }
    else {
      $scope.newTask.assignedUser = 'default';
      $scope.newTask.assignedUserName = 'unassigned';
    }

    TasksData.newTask($scope.newTask, function(data, err) {
      $scope.errorMes = err;
      $scope.selectedUser = -1;
      $scope.newTask = {};
      $scope.displayText = "Created Task";
    });
  };

}]);

demoControllers.controller('TaskDetailController', ['$scope', '$routeParams', 'TasksData', function($scope, $routeParams, TasksData) {
  TasksData.getTask($routeParams.id, function(task, err) {
    $scope.task = task;
    $scope.taskComplete = task.completed;
    $scope.errorMes = err;
  });

  $scope.$watch('taskComplete', function(newValue, oldValue) {
    $scope.task.completed = $scope.taskComplete;
    TasksData.editTask($scope.task, function(data, err) {
      $scope.errorMes = err;
    });
  });

}]);

demoControllers.controller('EditTaskController', ['$scope', '$routeParams', 'TasksData', 'UsersData', function($scope, $routeParams, TasksData, UsersData) {
  $scope.showMissingFields = false;
  $scope.selectedUser = -1;
  $scope.displayText = " ";

  var oldUser = "";

  TasksData.getTask($routeParams.id, function(task, err) {
    $scope.task = task;
    $scope.task.deadline = new Date(task.deadline);
    $scope.errorMes = err;

    UsersData.getSparseUsers(function(users, err) {
      $scope.errorMes = err;
      $scope.users = users;
      for(var i = 0; i < $scope.users.length; i++) {
        if($scope.users[i].name === $scope.task.assignedUserName) {
          $scope.selectedUser = i;
          break;
        }
      }
    });
  });

  $scope.editTask = function() {

    if(!$scope.task.name || !$scope.task.deadline) {
      $scope.showMissingFields = true;
      return;
    }

    if($scope.selectedUser !== -1) {
      $scope.task.assignedUser = $scope.users[$scope.selectedUser]._id;
      $scope.task.assignedUserName = $scope.users[$scope.selectedUser].name;
    }

    TasksData.editTask($scope.task, function(data, err) {
      $scope.errorMes = err;
    });
    $scope.displayText = "Edited Task";
  };
}]);

demoControllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl || 'localhost:4000';

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set";
  };

}]);

demoControllers.filter('pagination', function()
{
  return function(input, start) {
    start = parseInt(start, 10);
    return input.slice(start);
  };
});
