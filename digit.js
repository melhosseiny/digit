var S = {};

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

// convert grid to {square: digits}, or return false
// if a contradiction is detected
function parse_grid(grid) {
  var values = _.object(_.map(S.squares, function(s) {
    return [s, S.digits];
  }))
  // to start, every square can be any dighit; then assign values from the grid
  _.each(grid_values(grid), function(d,s) {
    if (S.digits.indexOf(d) !== -1 && !assign(values, s, d)) {
      return false;
    }
  })
  return values;
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
  if (values[s].length === 0) return false // contradiction: removed last value
  else if (values[s].length === 1) {
    var d2 = values[s];
    if (!_.every(S.peers[s], function(s2) { return eliminate(values, s2, d2) })) {
      return false;
    }
  }

  // (2) If a unit u is reduced to only one place for a value d, then put it
  // there
  _.each(S.units[s], function(u) {
    var dplaces = _.filter(u, function(s) {
      return values[s].indexOf(d) !== -1;
    })
    if (dplaces.length === 0) return false; // contradiction: no place for d
    else if (dplaces.length === 1) {
      // d can only only be in one place in unit; assign it there
      if (!assign(values, dplaces[0], d)) return false;
    }
  })
  return values;
}
