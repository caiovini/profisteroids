

export default class Stars{

    constructor(screen){

        this.parms = []
        for (let i = 0; i < 250; i++) {
            this.parms.push({

                position: {x: this.getRandomNumber(0, screen.width), 
                            y: this.getRandomNumber(0, screen.height)},
                strokeStyle: '#ffffff',
                fillStyle: '#ffffff',
                lineWidth: this.getRandomNumber(0.01, 0.1),
               
            })
          }

        

        this.speed = 2;
        this.boost = false;
        this.starMomentum = 0;
    }

    getRandomNumber(min, max){

        return Math.random() * (max - min + 1) + min;
    }

    setBoost(bst){

        this.boost = bst;
    }

    render(context, angle, screen){

        this.speed = this.boost ? 6 : 2;
        this.starMomentum = this.boost ? this.starMomentum === 25 ? this.starMomentum 
                : this.starMomentum + 0.5 : this.speed+1;

        this.parms.forEach(star =>{

            if (star.position.x > screen.width) { star.position.x = 0; }
            if (star.position.x < 0) { star.position.x = screen.width; }
            if (star.position.y > screen.height){ star.position.y = 0; }
            if (star.position.y < 0){ star.position.y = screen.height; }

            context.beginPath();
            context.moveTo(star.position.x - 
                                Math.sin(angle * Math.PI / 180) * this.starMomentum, 
                           star.position.y + 
                                Math.cos(angle * Math.PI / 180) * this.starMomentum);

            star.position.x = star.position.x - 
                Math.sin(angle * Math.PI / 180) * this.speed;

            star.position.y = star.position.y + 
                Math.cos(angle * Math.PI / 180) * this.speed;

            

            context.lineTo(star.position.x, star.position.y);
            //context.arc(star.position.x, star.position.y, 0.5, 0, 2 * Math.PI);
            context.strokeStyle = star.strokeStyle;
            context.fillStyle = star.fillStyle;
            context.lineWidth = star.lineWidth;
            context.closePath();
            context.fill();
            context.stroke();
            context.restore();
        });
    }
} 