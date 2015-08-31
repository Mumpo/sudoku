// Implements the doubled linked structure

function dlNode () {
	this.left = this;
	this.right = this;
	this.up = this;
	this.down = this;
}

var a = [
[0,0,1,0,1,1,0],
[2,0,0,2,0,0,2],
[0,3,3,0,0,3,0],
[4,0,0,4,0,0,0],
[0,5,0,0,0,0,5],
[0,0,0,6,6,0,6]
];

var w = [
['A',0,0,'A',0,0,'A'],
['B',0,0,'B',0,0,0],
[0,0,0,'C','C',0,'C'],
[0,0,'D',0,'D','D',0],
[0,'E','E',0,0,'E','E'],
[0,'F',0,0,0,0,'F']
];