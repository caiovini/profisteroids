export default class Particle{


    constructor(args) {

        this.radius = args.size;
        this.lifeSpan = args.lifeSpan;
        this.interval = args.interval;
        this.inertia = 0.98;
        this.fillStyle = '#ffffff';
        this.lineWidth = 2;
      }
    
    render(context, pos, angle, particles, range){

        let posDelta = this.rotatePoint({x:0, y:-20}, {x:0,y:0}, (angle-180) * Math.PI / 180);
        for(let i = 0; i < particles; i++){
        
            
            const position_part = {
                x: pos.x + posDelta.x + this.getRandomNumber(-range, range),
                y: pos.y + posDelta.y + this.getRandomNumber(-range, range)
            };

            
            // Shrink
            this.radius -= this.interval;
            if(this.radius < 0.1) this.radius = this.lifeSpan; 
            if(this.radius <= 0) return;
        
            context.save();
            context.translate(position_part.x, position_part.y);
            context.fillStyle = this.fillStyle;
            context.lineWidth = this.lineWidth;
            context.beginPath();
            context.moveTo(0, -this.radius);
            context.arc(0, 0, this.radius, 0, 2 * Math.PI);
            context.closePath();
            context.fill();
            context.restore();

        }
    }

    getRandomNumber(min, max){

        return Math.random() * (max - min + 1) + min;
    }

    rotatePoint(p, center, angle) {
        return {
          x: ((p.x-center.x)*Math.cos(angle) - (p.y-center.y)*Math.sin(angle)) + center.x,
          y: ((p.x-center.x)*Math.sin(angle) + (p.y-center.y)*Math.cos(angle)) + center.y
        };
    }
}   