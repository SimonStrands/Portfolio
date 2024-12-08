let canvas = document.getElementById("SpiderWebb");
let ctx = canvas.getContext("2d");
ctx.globalCompositeOperation = 'destination-atop';

const CanvasHeight = canvas.clientHeight;
const CanvasWidth = canvas.clientWidth;

ctx.canvas.width = CanvasWidth;
ctx.canvas.height = CanvasHeight;

var lastUpdate = Date.now();
var id = 0;

class Point{
    constructor(xPos, yPos, xDir, yDir)
    {
        this.xPos = xPos;
        this.yPos = yPos;
        this.xDir = xDir;
        this.yDir = yDir;
        this.lineWith = [];
        this.lines = [];
        this.id = id++;
    }
    removeALine(index)
    {
        this.lines.splice(index, 1);
        this.lineWith.splice(index, 1);
        for(let i = index; i < this.lines.length; i++)
        {
            this.lines[i].pointAddressPosition -= 1;
        }
    }
    haveLineWith(point){
        let haveALineWith = false;
        for(let i = 0; i < this.lineWith.length && !haveALineWith; i++)
        {
            haveALineWith = (this.lineWith[i].id == point.id);
        }
        return haveALineWith;
    }
}
const lineLife = 5;
class line{
    constructor(pointA, pointB, pointAddress, pointAddressPosition)
    {
        this.pointA = pointA;
        this.pointB = pointB;
        this.pointAddress = pointAddress;
        this.pointAddressPosition = pointAddressPosition;
        this.lifeLeft = lineLife;
    }
    update(dt)
    {
        this.lifeLeft -= dt * 0.001;
        if(length(this.pointA, this.pointB) > maxDistanceBetweenPoints + 100)
        {
            this.lifeLeft -= dt * 0.01;
        }
        if(length(this.pointA, this.pointB) > maxDistanceBetweenPoints + 600)
        {
            this.lifeLeft = -1;
        }
    }
    DrawLine(){
        if(this.lifeLeft <= 0)
        {
            return;
        }
        let opacity = 1 - Math.abs(((this.lifeLeft / lineLife) * 2) - 1);

        ctx.beginPath();
        ctx.moveTo(this.pointA.xPos, this.pointA.yPos);
        ctx.lineTo(this.pointB.xPos, this.pointB.yPos);
        ctx.lineWidth = 15;
        //ctx.strokeStyle = `rgba(${newColor[0]}, ${newColor[1]}, ${newColor[2]}, ${opacity})`; 
        ctx.strokeStyle = `rgba(128,128,128, ${opacity})`; 
        ctx.stroke();
    }
    isDead(){
        return this.lifeLeft < 0;
    }
    remove()
    {
        this.pointAddress.removeALine(this.pointAddressPosition);
    }
}
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function length(pointA, pointB)
{
    return Math.sqrt((pointA.xPos - pointB.xPos) *  (pointA.xPos - pointB.xPos) + (pointA.yPos - pointB.yPos) *  (pointA.yPos - pointB.yPos));
}

const randSpeed = 100;
const minSpeed = 20;
const nrOfPoints = 20;
const maxDistanceBetweenPoints = 300;
const maxNumberOfConnections = 4;
var Points = [];
var Lines = [];

function start()
{
    for(let i = 0; i < nrOfPoints; i++)
    {
        var p = new Point(getRandomInt(CanvasWidth),getRandomInt(CanvasHeight), getRandomInt(randSpeed) + minSpeed, getRandomInt(randSpeed) + minSpeed);
        if(p.xDir % 2 == 0)
        {
            p.xDir = -p.xDir;
        }
        if(p.yDir % 2 == 0)
        {
            p.yDir = -p.yDir;
        }
        Points.push(p);
        
    }
}

function update()
{
    ////////////////////////////////////////////////
    //clear screen + Get Delta time               // 
    let now = Date.now();            
    let dt = (now - lastUpdate) / 1000; // Calculate delta time in seconds
    let fps = (1 / dt).toFixed(2); // Correct FPS calculation
    lastUpdate = now; // Update lastUpdate time
    ctx.clearRect(0, 0, CanvasWidth, CanvasHeight);
    ////////////////////////////////////////////////
    updatePoints(dt);
    Draw();
    
    
    //Reloop Update
    window.requestAnimationFrame(update);
}

function Draw()
{
    for(let i = 0; i < Points.length; i++)
    {
        for(let l = 0; l < Points[i].lines.length; l++)
        {
            Points[i].lines[l].update(dt);  
        }
    }
    for(let i = 0; i < Points.length; i++)
    {
        for(let l = 0; l < Points[i].lines.length; l++)
        {
            Points[i].lines[l].DrawLine();  
        }
    }
    for(let i = 0; i < Points.length; i++)
    {
        ctx.beginPath();
        ctx.arc(Points[i].xPos, Points[i].yPos, 15, 0, 2 * Math.PI);
        ctx.fillStyle = "#808080";
        ctx.fill();
    }
}

function updatePoints(dt)
{
    //Move points;
    for(let i = 0; i < Points.length; i++)
    {
        Points[i].xPos += Points[i].xDir * dt;
        Points[i].yPos += Points[i].yDir * dt;

        if(Points[i].xPos > CanvasWidth + 40){
            Points[i].xPos = CanvasWidth + 40;
            Points[i].xDir = -Points[i].xDir;
        }
        if(Points[i].xPos < -40){
            Points[i].xPos = -40;
            Points[i].xDir = -Points[i].xDir;
        }
        if(Points[i].yPos > CanvasHeight - 40){
            Points[i].yPos = CanvasHeight - 40;
            Points[i].yDir = -Points[i].yDir;
        }
        if(Points[i].yPos < -40){
            Points[i].yPos = -40;
            Points[i].yDir = -Points[i].yDir;
        }
    }
    for(let i = 0; i < Points.length; i++)
    {
        for(let l = 0; l < Points[i].lines.length; l++)
        {
            Points[i].lines[l].update(dt);
            if(Points[i].lines[l].isDead())
            {
                Points[i].lines[l].remove();
            }  
        }
    }
    //Add lines
    //TODO : Check that we do not have the same connections
    for(let x = 0; x < Points.length; x++)
    {
        for(let y = x + 1; y < Points.length; y++)
        {
            if(length(Points[x], Points[y]) < maxDistanceBetweenPoints)
            {
                if(Points[x].lines.length < maxNumberOfConnections)
                {
                    if(!Points[x].haveLineWith(Points[y] )){
                        once = true;
                        let newLine = new line(Points[x], Points[y], Points[x], Points[x].lines.length);
                        Points[x].lines.push(newLine);
                        Points[x].lineWith.push(Points[y]);
                    }
                }
            }
        }
    }
        
}



start();
window.requestAnimationFrame(update);