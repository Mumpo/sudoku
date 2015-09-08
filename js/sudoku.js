function dlNode (data) {
	this.data = data;
	this.left = this;
	this.right = this;
	this.up = this;
	this.down = this;
}

dlNode.prototype.cover = function() {
	// Find column header
	var top = this;
	while (top.data != "c") {
		top = top.up;
	}

	// Detach the column
	top.left.right = top.right;
	top.right.left = top.left;

	// Delete the involved rows
	for (var row = top.down; row.data != "c"; row = row.down) {
		for (var node = row.right; node != row; node = node.right) {
			node.up.down = node.down;
			node.down.up = node.up;
		}
	}
}

dlNode.prototype.uncover = function() {
	// Find column header
	var top = this;
	while (top.data != "c") {
		top = top.up;
	}

	// Attach the column
	top.left.right = top;
	top.right.left = top;

	// Attach the involved rows
	for (var row = top.down; row.data != "c"; row = row.down) {
		for (var node = row.left; node != row; node = node.left) {
			node.up.down = node;
			node.down.up = node;
		}
	}
}

dlNode.prototype.count = function() {
	// Find column header
	var top = this;
	while (top.data != "c") {
		top = top.up;
	}

	// Count rows
	var count = 0;
	for (var row = top.down; row.data != "c"; row = row.down) {
		count++;
	}
	return count;
}

function exactCover() {
	this.head = new dlNode();
	this.head.data = "h";

	this.part = [];
	this.solution = [];
	this.solved = false;
}

exactCover.prototype.print = function() {
	for(var col = this.head.right; col != this.head; col = col.right) {
		var s = col.data ;
		for (var node = col.down; node != col; node = node.down) {
			s += " -> " + node.data;
		}
		console.log(s);
	}
}

exactCover.prototype.printh = function(col) {
	for(var row = this.head.right.down; row.data != "c"; row = row.down) {
		var s = row.data ;
		for (var node = row.right; node != row; node = node.right) {
			s += " -> " + node.data;
		}
		console.log(s);
	}
}

exactCover.prototype.printColumn = function(col) {
	var top = this.head;
	for (var i = 0; i <= col; i++) {
		top = top.right;
	}
	var s = top.data ;
	for (var node = top.down; node != top; node = node.down) {
		s += " -> " + node.data;
	}
	console.log(s);
}

// Reads a sparse matrix and create the double linked
// structure. The values for the 1's in the matrix should
// be the names of the rows
exactCover.prototype.fromMatrix = function(matrix) {
	var n = matrix.length;
	var m = matrix[0].length;

	var columns = [];
	columns[0] = new dlNode("c");
	columns[0].left = this.head;
	this.head.right = columns[0];

	// Create the header nodes
	for (var i = 1; i < m; i++) {
		columns[i] = new dlNode("c");
		columns[i-1].right = columns[i];
		columns[i].left = columns[i-1];
	}
	columns[m-1].right = this.head;
	this.head.left = columns[m-1];

	for (var i = 0; i < n; i++) {
		var lastLeft = null;
		var firstNode = undefined;
		if (this.head.left.down.data == undefined) {
			console.log("Hola");
		}

		for (var j = 0; j < m; j++) {
			var data = matrix[i][j];
			if (data != 0) {
				var newNode = new dlNode(data);

				if (lastLeft == null) {
					firstNode = newNode;
				}
				else {
					newNode.left = lastLeft;
					lastLeft.right = newNode;
				}

				newNode.up = columns[j];
				columns[j].down = newNode;
				
				columns[j] = newNode;
				lastLeft = newNode;
			}
		}
		if (lastLeft != null) {
			firstNode.left = lastLeft;
			lastLeft.right = firstNode;
		}
	}

	// Connect last row with headers
	var head = this.head.right;
	for (var i = 0; i < m; i++) {
		head.up = columns[i];
		columns[i].down = head; 

		head = head.right;
	}
};

exactCover.prototype.solve = function() {
	if (this.head.right == this.head) {
		this.solution = this.part.slice(); // Make a copy
		this.solved = true;
	}
	else {
		var minimum = this.head.right;
		var count = minimum.count();
		for (var column = minimum; column != this.head; column = column.right) {
			var c = column.count();
			if (c < count) {
				count = c;
				minimum = column;
			}
		}
		if (count == 0) return;
		minimum.cover();
		for (var row = minimum.down; row != minimum; row = row.down) {
			this.part.push(row.data);

			for (var col = row.right; col != row; col = col.right) {
				col.cover();
			}

			this.solve();
			this.part.pop();

			for (var col = row.left; col != row; col = col.left) {
				col.uncover();
			}

			if (this.solved) {
				minimum.uncover();
				return;
			}

		}
		minimum.uncover();
	}
};

function cell(num, row, col) {
	this.num = num;
	this.row = row;
	this.col = col;
}

cell.prototype.toString = function() {
	return "("+this.num+","+this.row+","+this.col+")";
}

function sudoku(n) {
	var width = n*n*n*n*4;
	var height = n*n*n*n*n*n;
	this.matrix = new Array(this.size);
	this.solution = [];
	
	// Fill the matrix with 0s
	for (var i = 0; i < height; i++) {
		this.matrix[i] = [];
		for (var j = 0; j < width; j++) {
			this.matrix[i][j] = 0;
		}
	}

	// Fill all the cells with possibilities
	var index_row = 0;
	var index_col;
	for (var row = 0; row < n*n; row++) {
		for (var col = 0; col < n*n; col++) {
			for (var num = 1; num <= n*n; num++) {
				// Position
				index_col = row*n*n + col;
				this.matrix[index_row][index_col] = new cell(num, row, col);

				// Row
				index_col = n*n*n*n + row*n*n + (num-1);
				this.matrix[index_row][index_col] = new cell(num, row, col);

				// Column
				index_col = 2*n*n*n*n + col*n*n + (num-1);
				this.matrix[index_row][index_col] = new cell(num, row, col);

				// Region
				index_col = 3*n*n*n*n + Math.floor(row/n)*n*n*n + Math.floor(col/n)*n*n + (num-1);
				this.matrix[index_row][index_col] = new cell(num, row, col);

				++index_row;
			}
		}
	}
}

sudoku.prototype.solve = function() {
	this.ex = new exactCover();
	this.ex.fromMatrix(this.matrix);
	this.ex.solve();
	this.solution = this.ex.solution;
}

function runSudoku() {
	var size = 3;
	var inputs = [];

	var su = new sudoku(size);
	var n = size*size;
	var matrix = su.matrix;
	var m = matrix[0].length;

	for (var row = 0; row < n; row++) {
		for (var col = 0; col < n; col++) {
			var inp = document.getElementById("input_"+row+"_"+col).value;
			if (inp != "") {
				//console.log("input_"+row+"_"+col);
				var num = parseInt(inp) - 1;
				var index;
				for (var k = 0; k < n; k++) {
					//console.log("k = "+k);
					// Position
					if (k != num) {
						index = row*n*n + col*n + k;
						for (var p = 0; p < m; p++) {
							matrix[index][p] = 0;
						}
					}
					//if (k != num) console.log("Position: "+index);
					// Row
					if (k != col) {
						index = row*n*n + k*n + num;
						for (var p = 0; p < m; p++) {
							matrix[index][p] = 0;
						}
					}
					//if (k != col) console.log("Row: "+index);
					// Col
					if (k != row) {
						index = k*n*n + col*n + num;
						for (var p = 0; p < m; p++) {
							matrix[index][p] = 0;
						}
					}
					//if (k != row) console.log("Column: "+index);
				}
				for (var k = 0; k < size; k++) {
					for (var l = 0; l < size; l++) {
						if (k != row%size || l != col%size) {
							index = (row-row%size+k)*n*n + (col-col%size+l)*n + num;
							for (var p = 0; p < m; p++) {
								matrix[index][p] = 0;
							}
							//console.log("Region: "+index);
						}
					}
				}
			}
		}
	}

	su.solve();

	var solution = su.solution;
	if (solution != []) {
		for (var i = 0; i < solution.length; i++) {
			var row = solution[i].row;
			var col = solution[i].col;
			var elem = document.getElementById("input_"+row+"_"+col);
			elem.value = solution[i].num;
		}
	}
	return su;
}