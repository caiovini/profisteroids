import React, { Component } from "react";
import Ship from "./Ship";
import Stars from "./Stars";
import Avatar from '@mui/material/Avatar';
import Selfie from "./static/images/selfie.jpeg";
import Asteroid from "./Asteroid";
import LinkedinLogo from "./static/images/linkedin.svg";
import XingLogo from "./static/images/xing.svg";
import GithubLogo from "./static/images/github.png";
import useWindowDimensions from "./WindowDimensions";



const KEY = {
    LEFT:  37,
    RIGHT: 39,
    UP: 38,
    SPACE: 32
  };

const MEDIA = {
    LINKEDIN:  "Linkedin",
    GITHUB: "Github",
    XING: "Xing"
  };

class Profile extends Component{


    constructor(props){
        super()

        
        this.state = {
            screen: {
              width: window.innerWidth,
              height: window.innerHeight,
              ratio: window.devicePixelRatio || 1,
            },

            context: null,
            destroyAsteroid: false
        }
        this.ship = new Ship({
            position: {
              x: this.state.screen.width/2,
              y: this.state.screen.height/2
            }
          });
        this.stars = new Stars(this.state.screen);
        this.isShooting = false;
        this.asteroids = [
            new Asteroid({
                size: 80,
                position: {
                x: 100,
                y: this.state.screen.height - 100},
                id: MEDIA.LINKEDIN}),
            new Asteroid({
                size: 80,
                position: {
                x: this.state.screen.width - 100,
                y: this.state.screen.height - 100},
                id: MEDIA.GITHUB}),
            new Asteroid({
                size: 80,
                position: {
                x: this.state.screen.width - 100,
                y: 100},
                id: MEDIA.XING})
        ];

        this.keyLeftPressed = false;
        this.keyRightPressed = false;
          
    }

    componentDidMount(){

        window.addEventListener('keydown', this.handleKeysDown.bind(this, true));
        window.addEventListener('keyup', this.handleKeysUp.bind(this, true));
        window.addEventListener('resize',  this.handleResize.bind(this, false));
        this.setState({ context: this.refs.canvas.getContext('2d') });
        requestAnimationFrame(() => {this.update()});
        
    }

    handleResize(value, e){
        this.setState({
          screen : {
            width: window.innerWidth,
            height: window.innerHeight,
            ratio: window.devicePixelRatio || 1,
          }
        });
        this.stars = new Stars(this.state.screen);
        this.ship = new Ship({
            position: {
              x: this.state.screen.width/2,
              y: this.state.screen.height/2
            }
        });

        this.asteroids.forEach(asteroid => {

            switch (asteroid.getId()){

                case MEDIA.LINKEDIN:
                    asteroid.setPosition({
                        x: 100,
                        y: this.state.screen.height - 100})
                    break;
                case MEDIA.GITHUB:
                    asteroid.setPosition({
                        x: this.state.screen.width - 100,
                        y: this.state.screen.height - 100})
                    break;
                case MEDIA.XING:
                    asteroid.setPosition({
                        x: this.state.screen.width - 100,
                        y: 100})
                    break;
                default:
                    break;

            }
        });
    }

    handleKeysDown(value, e){

        
        if(e.keyCode === KEY.LEFT){
            this.keyLeftPressed = true;
        }

        if(e.keyCode === KEY.RIGHT){
            this.keyRightPressed = true;
        }

        if(e.keyCode === KEY.UP){
            this.stars.setBoost(true);
            this.ship.setBoost(true);
        }

        if (!this.isShooting){
            if(e.keyCode === KEY.SPACE){
                this.ship.shoot();
                this.isShooting = true;
            }
        }
    }

    handleKeysUp(value, e){

        if(e.keyCode === KEY.UP){
            this.stars.setBoost(false);
            this.ship.setBoost(false);
        }

        if(e.keyCode === KEY.SPACE){
            this.isShooting = false;
        }

        if(e.keyCode === KEY.LEFT){
            this.keyLeftPressed = false;
        }

        if(e.keyCode === KEY.RIGHT){
            this.keyRightPressed = false;
        }

    }

    update(){
        
        const context = this.state.context;

        context.save();
        //context.scale(this.state.screen.ratio, this.state.screen.ratio);

        if (this.keyLeftPressed) this.ship.rotate("LEFT");
        if (this.keyRightPressed) this.ship.rotate("RIGHT");

        // clear screen
        context.fillStyle = '#000';
        context.globalAlpha = 0.4;
        context.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
        context.globalAlpha = 1;

        this.ship.render(context, this.state.screen);
        this.stars.render(context, this.ship.getAngle(), this.state.screen);

        const bullets = this.ship.getBullets();
        let didCollide = false;
        this.asteroids.forEach(asteroid => {

            asteroid.render(context);

            bullets.forEach(bullet => {

                didCollide = this.checkCollision({
                    position: bullet.position,
                    radius: bullet.getRadius()
                },
                {
                    position: asteroid.getPosition(),
                    radius: asteroid.getRadius()
                });
    
                if (didCollide) { 
                    bullet.setShowing(false);
                    asteroid.destroy();
                    this.setState({ destroyAsteroid: true });
                };
            });
        });

        context.restore();
        requestAnimationFrame(() => {this.update()});
    }

    checkCollision(obj1, obj2){
        let vx = obj1.position.x - obj2.position.x;
        let vy = obj1.position.y - obj2.position.y;
        let length = Math.sqrt(vx * vx + vy * vy);
        if(length < obj1.radius + obj2.radius){
          return true;
        }
        return false;
    }

    render(){
        

        let badges = [];

        this.asteroids.forEach(asteroid => {

            if (asteroid.isDestroy()){

                switch (asteroid.getId()){

                    case MEDIA.LINKEDIN:
                        badges.push(

                            <a href="https://www.linkedin.com/in/caiovinireis/" 
                               key={MEDIA.LINKEDIN}
                               target="_blank" 
                               rel="noreferrer">
                                <img className="badges linkedin"
                                    src={LinkedinLogo}
                                    alt="Linkedin"
                                />
                            </a>
                        );
                        break;
                    case MEDIA.GITHUB:
                        badges.push(

                            <a href="https://github.com/caiovini" 
                               key={MEDIA.GITHUB}
                               target="_blank"
                               rel="noreferrer">
                                <img className="badges github"
                                    src={GithubLogo}
                                    alt="Github"
                                />
                            </a>
                        );
                        break;
                    case MEDIA.XING:
                        badges.push(

                            <a href="https://www.xing.com/profile/CaioVinicius_NascimentoReis" 
                               key={MEDIA.XING} 
                               target="_blank"
                               rel="noreferrer">
                                <img className="badges xing"
                                    src={XingLogo}
                                    alt="Xing"
                                />
                            </a>
                        );
                        break;
                    default:
                        break;

                }
            }
        });

        return(
                        
            <div>
                { badges }
                <span className="avatar" >
                    <Avatar
                        alt="Caio Vinicius"
                        src={Selfie}
                        sx={{ width: 180, height: 180 }}
                    />   
                    <br/>        
                    Salute,<br/> My name is Caio, I am<br/> a software engineer from Brazil.<br/>
                    Please, hit the meteors to reveal<br/> my social media links and feel free<br/>
                    to have a look at my personal projects.
                </span>   
                <span className="controls" >
                    Use [←][↑][→] to MOVE<br/>
                    Use [SPACE] to SHOOT      
                    
                </span>
                <canvas ref="canvas"
                    width={this.state.screen.width }
                    height={this.state.screen.height }   
                />  
            </div>
            
        )
    }
}

export default Profile;