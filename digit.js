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
