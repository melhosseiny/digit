var digit = angular.module('digit', [])

digit.value('S', S);

/* Filters */

// hide values of square s if it has more than 1 possibility
digit.filter('hideifmany', function() {
  return function(value) {
    return value.length > 1? '' : value;
  }
})

/* Controllers */

digit.controller('DigitCtrl', ['$scope', '$timeout', 'S', function DigitCtrl($scope, $timeout, S) {
  $scope.S = S;

  $scope.init_puzzle = parse_grid_no_cp(S.wikigrid);
  $scope.puzzle = angular.copy($scope.init_puzzle);

  $scope.active_peers = []; // peers of the cell the user is interested in

  $scope.init_moment = moment();
  $scope.elapsed_time = 0;
  var timeout_id;

  // create a new random puzzle
  $scope.new_puzzle = function() {
    $scope.init_puzzle = parse_grid_no_cp(random_puzzle());
    $scope.puzzle = angular.copy($scope.init_puzzle);
    $scope.init_moment = moment();
    $scope.tick();
  }

  // solve the puzzle
  $scope.solve = function() {
    $scope.puzzle = search(parse_grid(to_grid($scope.init_puzzle)));
    $scope.solved_by_machine = true;
    $timeout.cancel(timeout_id);
  }

  // make the clock tick
  $scope.tick = function() {
    var diff = moment().diff($scope.init_moment);
    var duration = moment.duration(diff);
    $scope.elapsed_time = [_.str.pad(duration.hours(), 2, '0'),
                           _.str.pad(duration.minutes(), 2, '0'),
                           _.str.pad(duration.seconds(), 2, '0')].join(':');
    timeout_id = $timeout($scope.tick, 1000);
  }

  // is every square filled?
  $scope.is_filled = function() {
    return _.every($scope.puzzle, function(v, k) {
      return v.length === 1;
    })
  }

  // did the user solve the puzzle?
  $scope.check = function() {
    if ($scope.is_filled()) {
      $scope.solution = search(parse_grid(to_grid($scope.puzzle)));
      if (to_grid($scope.puzzle) === to_grid($scope.solution)) {
        $timeout.cancel(timeout_id);
        return true;
      }
    }
  }

  // assign a value to a square by rotating values
  $scope.rotate = function(square) {
    $scope.active_peers = S.peers[square];
    if ($scope.init_puzzle[square].length !== 1) {
      // get initial peers to omit
      var omit = _.uniq(_.filter(_.map(S.peers[square], function(p) {
        return $scope.init_puzzle[p]
      }), function(v) {
        return v.length === 1;
      }));
      var next = $scope.puzzle[square].length > 1? 1 :
        1 + ((+($scope.puzzle[square])) % 9);
      while (omit.indexOf(next.toString()) != -1) {
        next = 1 + (next % 9);
      }
      assign_no_cp($scope.puzzle, square, next.toString());
    }
  }

  // set active peers to the peers of the square the user is interested in
  $scope.highlight_peers = function(square) {
    $scope.active_peers = S.peers[square];
  }

  $scope.tick(); // start the clock
}]);
