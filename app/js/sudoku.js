var S = {};

S.grid1 = '003020600900305001001806400008102900700000008006708200002609500800203009005010300'
S.grid2 = '4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......'
S.wikigrid = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79'
S.digits = '123456789';
S.rows = 'ABCDEFGHI';
S.rowss = ['ABC','DEF','GHI'];
S.cols = S.digits;
S.colss = ['123','456','789'];
S.squares = cross(S.rows, S.cols);
S.unitlist = []; // a list of all units (column, row or box)

_.each(S.cols, function(c) {
  S.unitlist.push(cross(S.rows, c));
})
_.each(S.rows, function(r) {
  S.unitlist.push(cross(r, S.cols));
})
_.each(S.rowss, function(rs) {
  _.each(S.colss, function(cs) {
    S.unitlist.push(cross(rs, cs));
  })
})

S.units = {} // square s maps to the list of units that contain s
_.each(S.squares, function(s) {
  S.units[s] = _.filter(S.unitlist, function(u) {
    return _.contains(u,s);
  })
})

S.peers = {} // peers are the square that share a unit
_.each(S.squares, function(s) {
  // square s maps to the set of square formed by the union
  // of the squares in the units of s, but not s itself
  S.peers[s] = _.uniq(_.without(_.flatten(S.units[s]), s));
})

// cross product of elements in A and elements in B
function cross(A, B) {
    var C = [];
    _.each(A, function(a) {
      _.each(B, function(b) {
        C.push(a+b);
      })
    })
    return C;
}

// convert grid to {square: digits}, or return false
// if a contradiction is detected
function parse_grid(grid) {
  var values = _.object(_.map(S.squares, function(s) {
    return [s, S.digits];
  }))
  // to start, every square can be any digit; then assign values from the grid
  _.each(grid_values(grid), function(d,s) {
    if (S.digits.indexOf(d) !== -1 && !assign(values, s, d)) {
      return false;
    }
  })
  return values;
}

// convert grid to {square: digits}, or return false
// if a contradiction is detected
function parse_grid_no_cp(grid) {
  var values = _.object(_.map(S.squares, function(s) {
    return [s, S.digits];
  }))
  // to start, every square can be any digit; then assign values from the grid
  _.each(grid_values(grid), function(d,s) {
    if (S.digits.indexOf(d) !== -1 && !assign_no_cp(values, s, d)) {
      return false;
    }
  })
  return values;
}

// convert {square: digits} to grid
function to_grid(values) {
  return _.map(_.values(values), function(v) {
    return v.length > 1? '.' : v;
  }).join('');
}

// grid to {square: char} with '0' or '.' for empties
function grid_values(grid) {
  return _.object(_.map(_.filter(grid, function(c) {
    return (S.digits+'0.').indexOf(c) !== -1;
    // ignore any character that is not a digit, a 0 or a period
  }), function(c, i) {
    return [S.squares[i], c];
  }))
}

// assign value d to square s with no constraint propagation
function assign_no_cp(values, s, d) {
  values[s] = d;
  return values;
}

// eliminate all the other values (except d) from values[s] and propagate
// return values, except return false if a contradiction is detected
function assign(values, s, d) {
  var other_values = values[s].replace(d,'');
  if (_.every(other_values, function(d2) { return eliminate(values, s, d2) })) {
    return values;
  } else {
    return false;
  }
}

// eliminate d from values[s]; propagate when values or places <= 2
// return values, except return false if a contradiction is detected
function eliminate(values, s, d) {
  if (values[s].indexOf(d) === -1) {
    return values; // already eliminated
  }
  values[s] = values[s].replace(d,'');

  // (1) If a square is reduced to one value d2, then eliminate d2 from peers
  if (values[s].length === 0) return false; // contradiction: removed last value
  else if (values[s].length === 1) {
    var d2 = values[s];
    if (!_.every(S.peers[s], function(s2) { return eliminate(values, s2, d2) })) {
      return false;
    }
  }

  // (2) If a unit u is reduced to only one place for a value d, then put it
  // there
  for (var u = 0; u < S.units[s].length; u++) { // _.each doesn't seem to work
    var dplaces = _.filter(S.units[s][u], function(s) {
      return values[s].indexOf(d) !== -1;
    })

    if (dplaces.length == 0)
      return false;
    else if (dplaces.length == 1)
      if (!assign(values, dplaces[0], d))
        return false;
  }
  return values;
}

// display these values as a 2-D grid
function display(values) {
  var width = 1 + _.max(values, function(v, k) {
    return v.length;
  }).length;
  var line = [];
  _.times(3, function(n) { line.push(Array(width*3 + 1).join('-')); })
  line = line.join('+');
  _.each(S.rows, function(r) {
    console.log(_.map(S.cols, function(c) {
      return _.str.center(values[r+c], width) + (('36'.indexOf(c) !== -1)? '|' : '')
    }).join(''));
    if ('CF'.indexOf(r) !== -1) console.log(line);
  })
}

// using depth-first search and propagation, try all possible values
function search(values) {
  if (!values) return false; // failed earlier

  _.every(S.squares, function(s) {
    return values[s].length === 1;
  })

  if (_.every(S.squares, function(s) {
    return values[s].length === 1;
  })) return values; // Solved!

  // Choose the unfilled square s with the fewest possibilities
  var s = _.min(_.filter(S.squares, function(s) {
    return values[s].length > 1;
  }), function(s) {
    return values[s].length;
  });

  for (var d = 0; d < values[s].length; d++) {
    var res = search(assign(_.clone(values), s, values[s].charAt(d)));
    if (res) return res;
  }
  return false;
}

function solve(grid) { return display(search(parse_grid(grid))) }

// Make a random puzzle with N or more assignments. Restart on contradictions.
// Note the resulting puzzle is not guaranteed to be solvable, but empirically
// about 99.8% of them are solvable. Some have multiple solutions.
function random_puzzle(N) {
  N = N || 17;
  var values = {};
  _.each(S.squares, function(s) {
    values[s] = S.digits;
  })

  var shuffled_squares = _.shuffle(S.squares);
  for (var i = 0; i < shuffled_squares.length; i++) {
    var s = shuffled_squares[i];
    if (!assign(values, s, _.sample(values[s]))) {
      break;
    }
    var ds = _.map(_.filter(S.squares, function(s) {
      return values[s].length === 1;
    }), function(s) {
      return values[s];
    });
    if (ds.length >= N && _.uniq(ds).length >= 8) {
      return _.map(S.squares, function(s) {
        if (values[s].length === 1) return values[s];
        else return '.';
      }).join('');
    }
  }
  return random_puzzle(N); // give up and make a new puzzle
}
