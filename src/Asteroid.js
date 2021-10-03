import Particle from './Particle';

export default class Asteroid {
  constructor(args) {
    this.position = args.position
    this.radius = args.size;
    this.rotation = 2;
    this.rotationSpeed = 2;
    this.strokeStyle = '#FFF';
    this.vertices = this.asteroidVertices(8, args.size);
    this.id = args.id;

    this.particle = new Particle({
        lifeSpan: 0,
        size: 3,
        interval: 0.01
    });

    this.isDestroyed = false;
  }

  asteroidVertices(count, rad) {
    let p = [];
    for (let i = 0; i < count; i++) {
      p[i] = {
        x: (-Math.sin((360/count)*i*Math.PI/180) + Math.round(Math.random()*2-1)*Math.random()/3)*rad,
        y: (-Math.cos((360/count)*i*Math.PI/180) + Math.round(Math.random()*2-1)*Math.random()/3)*rad
      };
    }
    return p;
  };

  destroy(){
    
    this.isDestroyed = true;
  }

  isDestroy(){
    
    return this.isDestroyed;
  }

  getRadius(){

    return this.radius;
  }

  getPosition(){

    return this.position;
  }

  setPosition(position){

    this.position = position;
  }

  getId(){

    return this.id;
  }

  render(context){

    if (!this.isDestroyed){

        this.rotation -= this.rotationSpeed;
        
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotation * Math.PI / 180);
        context.strokeStyle = this.strokeStyle;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(0, -this.radius);
        for (let i = 1; i < this.vertices.length; i++) {
        context.lineTo(this.vertices[i].x, this.vertices[i].y);
        }
        context.closePath();
        context.stroke();
        context.restore();
    } else {
        
        this.particle.render(context, this.position, 0, 10, 50 );
    }
  }
}