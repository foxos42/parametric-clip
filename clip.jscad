function getParameterDefinitions(){
    return [
        {name:'d',  caption:'inner diameter:',type:'float',initial:58,min:0.1,max:4200,step:0.1},
        {name:'h',  caption:'height:',        type:'float',initial:15,min:0.1,max:420, step:0.1},
        {name:'t',  caption:'thickness:',     type:'float',initial:3, min:0.1,max:420, step:0.1},
        {name:'res',caption:'resolution:',    type:'int',  initial:64,min:3,  max:360, step:1}
    ];
}

function main (p) {
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
    
    return path.rectangularExtrude(p.t, p.h, p.res, true);
}
