
import Bullet from "./Bullet";
import Particle from "./Particle";

export default class Ship{

    constructor(args){

        this.parms = {

            position: args.position,
            angle: 0,
            strokeStyle: '#ffffff',
            fillStyle: '#000000',
            lineWidth: 2,
            moveTo: { x: 0, y: -15 },
            lines: [{ x: 10, y: 10},
                    { x: 5, y: 7},  
                    { x: -5, y: 7},
                    { x: -10, y: 10} ]
        }

        this.rotationInertia = 0;

        
        // Thruster particles
        this.particle = new Particle({
            lifeSpan: 5,
            size: 5,
            interval: 0.1
        });
        this.boost = false;
        this.bullets = [];
    }

    rotate(direction){

        if (direction === 'LEFT') {
            this.rotationInertia = -2;
        } else {
            this.rotationInertia = 2;
        }
    }

    getAngle(){

        return this.parms.angle;
    }

    getPosition(){

        return this.parms.position;
    }

    getBullets(){

        return this.bullets;
    }

    setBoost(bst){

        this.boost = bst;
    }

    shoot(){

        const bullet = new Bullet({x: this.parms.position.x,
                                    y: this.parms.position.y},
                                        this.parms.angle);
        this.bullets.push(bullet);

    }


    render(context, screen){

        this.parms.angle += this.rotationInertia;

        if (this.rotationInertia > 0) this.rotationInertia -= 2;
        if (this.rotationInertia < 0) this.rotationInertia += 2;
        
        if (this.boost)
            this.particle.render(context, this.parms.position, this.parms.angle, 5, 10);

        this.bullets.forEach(bullet => {
            bullet.render(context, screen);
        });
        
       
        context.save();
        context.translate(this.parms.position.x, this.parms.position.y);
        context.rotate(this.parms.angle * Math.PI / 180);
        context.strokeStyle = this.parms.strokeStyle;
        context.fillStyle = this.parms.fillStyle;
        context.lineWidth = this.parms.lineWidth;
        context.beginPath();
        context.moveTo(this.parms.moveTo.x, this.parms.moveTo.y);

        this.parms.lines.forEach(coord => {

            context.lineTo(coord.x, coord.y);
        });
            
        context.closePath();
        context.fill();
        context.stroke();
        context.restore();
    }
}