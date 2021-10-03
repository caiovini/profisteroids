

export default class Bullet{

    constructor(position, angle){

        this.position = position;
        this.strokeStyle = '#AF9B60';
        this.fillStyle = '#AF9B60';
        this.lineWidth = 5;
        this.speed = 10;
        this.angle = angle;
        this.showing = true;
    }

    getPosition(){

        return this.position;
    }

    getRadius(){

        return this.lineWidth;
    }

    setShowing(show){

        this.showing = show;
    }

    render(context, screen){

        if (!this.showing) return;

        if (this.position.x > screen.width || this.position.x < 0
            || this.position.y > screen.height || this.position.y < 0){ 

            this.showing = false;
            return;        
        }

        this.position.x = this.position.x + 
            Math.sin(this.angle * Math.PI / 180) * this.speed;

        this.position.y = this.position.y - 
            Math.cos(this.angle * Math.PI / 180) * this.speed;


        context.beginPath();
        context.arc(this.position.x, this.position.y, 1, 0, 2 * Math.PI);
        context.strokeStyle = this.strokeStyle;
        context.fillStyle = this.fillStyle;
        context.lineWidth = this.lineWidth;
        context.closePath();
        context.fill();
        context.stroke();
        context.restore();
    }
}