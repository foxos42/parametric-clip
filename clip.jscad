function getParameterDefinitions(){
	return [
		{name:'d',  caption:'inner diameter:',type:'float',initial:58,min:0.1,max:4200,step:0.1},
		{name:'h',  caption:'height:',        type:'float',initial:15,min:0.1,max:420, step:0.1},
		{name:'t',  caption:'thickness:',     type:'float',initial:3, min:0.1,max:420, step:0.1},
		{name:'res',caption:'resolution:',    type:'int',  initial:32,min:3,  max:360, step:1},
		{name:'round',caption:'sides rounded(slow):', type:'checkbox', checked: false}
	];
}

function main (p) {
	mods();

	var result=[];
	var circle=CSG.Path2D.arc({
		center: [0,0,0],
		radius: p.d/2+p.t/2,
		startangle: 45,
		endangle: 315,
		resolution: p.res,
	});
	console.log(circle);

	var path=new CSG.Path2D([[circle.points[0]._x+p.d/2/3,circle.points[0]._y+p.d/2/3/2]],false);
	path=path.concat(circle);
	path=path.appendPoint([path.points[path.points.length-1]._x+p.d/2/3,path.points[path.points.length-1]._y-p.d/2/3/2]);
    
	if(!p.round){
		result.push(path.rectangularExtrude(p.t, p.h, p.res, true));
	}else{
		var topBottomRound = translate([0,0,p.t/2],path.circularExtrude(p.t/2, p.res));
		result.push(topBottomRound);//bottom
		result.push(translate([0,0,p.t/2],path.rectangularExtrude(p.t, p.h-p.t, p.res, true)));
		result.push(translate([0,0,p.h-p.t],topBottomRound));//top
	}
	
	return union(result);
}

function mods(){
	CSG.Path2D.prototype.circularExtrude = function(r,res){//TODO: unslow
		var result = [];
		
		for (var i = 0; i < this.points.length - 1; i++) {
			//result.push(cylinder({start:this.points[i], end:this.points[i+1], radius:r, fn:res, round:true}))//TODO: use this if issue is fixed:  https://github.com/jscad/scad-api/issues/2
			result.push(CSG.roundedCylinder({start:this.points[i], end:this.points[i+1], radius:r, resolution:res, round:true}))//workaround
		}
		
		return union(result);
	};
}
