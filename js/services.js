// js/services/todos.js

function getBaseUrl(window) {
  var url = 'http://' + (window.sessionStorage.baseurl || 'localhost:4000');
  return url;
}

function getRequest(http, window, _data, path, cb) {
  if(_data !== null) cb(_data);

  http.get(getBaseUrl(window) + path)
    .success(function(data, status, headers, config) {
      _data = data.data;
      cb(_data, "");
    })
    .error(function(data, status, headers, config) {
      cb(null, data);
    });
}

function postRequest(http, window, _data, newData, path, cb) {
  http.post(getBaseUrl(window) + path, newData)
    .success(function(data, status, headers, config) {
      cb(data, "");
    })
    .error(function(data, status, headers, config) {
      cb(null, data);
    });
}

function putRequest(http, window, newData, path, cb) {
  http.put(getBaseUrl(window) + path, newData)
    .success(function(data, status, header, config) {
      cb(data, "");
    })
    .error(function(data, status, headers, config) {
      cb(null, data);
    });
}

function deleteRequest(http, window, path) {
  http.delete(getBaseUrl(window) + path)
    .success(function(data, status, headers, config) {
      cb(data, "");
    })
    .error(function(data, status, headers, config) {
      cb(null, data);
    });
}

angular.module('demoServices', [])
    .factory('TasksData', ['$http', '$window', function($http, $window){
      var _data = null;

      return{
          getTasks : function(cb) {
            getRequest($http, $window, _data, '/api/tasks', cb);
          },
          getSortedTasks : function(sort, order, cb) {
            getRequest($http, $window, _data, '/api/tasks?sort={"' + sort + '": ' + order + '}', cb);
          },
          getUserTasks : function(userId, cb) {
            getRequest($http, $window, _data, '/api/tasks?where={"assignedUser": "'+ userId + '", "completed": false}', cb);
          },
          getCompletedUserTasks : function(id, cb) {
            getRequest($http, $window, _data, '/api/tasks?where={"assignedUser": "'+ id + '", "completed": true}', cb)
          },
          getTask : function(id, cb) {
            getRequest($http, $window, _data, '/api/tasks/' + id, cb);
          },
          newTask : function(task, cb) {
            postRequest($http, $window, _data, task, '/api/tasks', cb);
          },
          editTask : function(task, cb) {
            putRequest($http, $window, task, '/api/tasks/' + task._id, cb);
          },
          deleteTask : function(id, cb) {
            deleteRequest($http, $window, '/api/tasks/' + id, cb);
          }
      }
    }])
    .factory('UsersData', ['$http', '$window', function($http, $window) {
      var _data = null;

      return {
        getUsers : function(cb) {
          getRequest($http, $window, _data, '/api/users', cb);
        },

        getUser : function(id, cb) {
          getRequest($http, $window, _data, '/api/users/' + id, cb);
        },

        getSparseUsers : function(cb) {
          getRequest($http, $window, _data, '/api/users?select={"name": 1, "_id": 1}', cb);
        },

        addUser : function(user, cb) {
          postRequest($http, $window, _data, user, '/api/users', cb);
        },

        deleteUser : function(id, cb) {
          deleteRequest($http, $window, '/api/users/' + id, cb);
        }
      }
    }])
    ;
