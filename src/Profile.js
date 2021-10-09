import React, { Component } from "react";
import { ComponentTransition, AnimationTypes } from "react-component-transition";
import Ship from "./Ship";
import Stars from "./Stars";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Selfie from "./static/images/selfie.jpeg";
import Linkedin_selfie from "./static/images/linkedin_selfie.jpeg";
import Xing_selfie from "./static/images/xing_selfie.jpg";
import Asteroid from "./Asteroid";
import LinkedinLogo from "./static/images/linkedin.svg";
import XingLogo from "./static/images/xing.svg";
import GithubLogo from "./static/images/github.png";


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
            destroyAsteroid: false,
            showXingPreviewLink: false,
            showGithutPreviewLink: false,
            showLinkedinPreviewLink: false
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
                x: 150,
                y: this.state.screen.height - 100},
                id: MEDIA.LINKEDIN}),
            new Asteroid({
                size: 80,
                position: {
                x: this.state.screen.width - 150,
                y: this.state.screen.height - 100},
                id: MEDIA.GITHUB}),
            new Asteroid({
                size: 80,
                position: {
                x: this.state.screen.width - 150,
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
                        x: 150,
                        y: this.state.screen.height - 100})
                    break;
                case MEDIA.GITHUB:
                    asteroid.setPosition({
                        x: this.state.screen.width - 150,
                        y: this.state.screen.height - 100})
                    break;
                case MEDIA.XING:
                    asteroid.setPosition({
                        x: this.state.screen.width - 150,
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

    toggleHoverMouseEnter(e, media){

        e.preventDefault();
        switch (media){

            case MEDIA.LINKEDIN:
                this.setState({showLinkedinPreviewLink:true});
                break;
            case MEDIA.GITHUB:
                this.setState({showGithutPreviewLink:true});
                break;
            case MEDIA.XING:
                this.setState({showXingPreviewLink:true});
                break;
            default:
                break;

        }
        
    }

    toggleHoverMouseLeave(e, media) {
      
        e.preventDefault();
        switch (media){

            case MEDIA.LINKEDIN:
                this.setState({showLinkedinPreviewLink:false});
                break;
            case MEDIA.GITHUB:
                this.setState({showGithutPreviewLink:false});
                break;
            case MEDIA.XING:
                this.setState({showXingPreviewLink:false});
                break;
            default:
                break;

        }
  
      }

    render(){
        

        let badges = [];

        this.asteroids.forEach(asteroid => {

            if (asteroid.isDestroy()){

                switch (asteroid.getId()){

                    case MEDIA.LINKEDIN:
                        badges.push(

                            <div className="badges linkedin" 
                                onMouseEnter={ (e) => this.toggleHoverMouseEnter(e, MEDIA.LINKEDIN)}
                                onMouseLeave={ (e) => this.toggleHoverMouseLeave(e, MEDIA.LINKEDIN)}
                                key={MEDIA.LINKEDIN} >
                                <a href="https://www.linkedin.com/in/caiovinireis/?locale=en_US" 
                                target="_blank" 
                                rel="noreferrer">
                                    <img className="badge-effect"
                                        src={LinkedinLogo}
                                        alt="Linkedin"
                                    />
                                </a>
                                <ComponentTransition
                                    exitAnimation={AnimationTypes.fade.exit}
                                >
                                { this.state.showLinkedinPreviewLink ?  
                                    <Card style={{backgroundColor: "rgba(255, 255, 255, 0.9)" ,
                                          opacity: 0.9, bottom: 110, left: 180, position: "fixed"}} 
                                        sx={{ maxWidth: 300, 
                                        color: 'background.paper',
                                        boxShadow: 1,
                                        borderRadius: 1,
                                        p: 2,
                                        minWidth: 300,}}> 
                                        <CardMedia
                                            component="img"
                                            height="194"
                                            image={Linkedin_selfie}
                                            alt="linkedin_selfie"
                                        />
                                        <CardContent >
                                            <Typography variant="body2" color="text.primary">
                                                View my profile on LinkedIn, the world’s largest professional community.
                                                I have listed my experiences as well as some articles I wrote related to blockchain
                                                which is a subject I am deeply interested.<br/><br/>
                                                <a href="https://www.linkedin.com/in/caiovinireis/?locale=en_US" 
                                                   target="_blank"
                                                   rel="noreferrer">
                                                Check it out here </a>
                                            </Typography>
                                        </CardContent>
                                    </Card>      
                                : "" }
                                </ComponentTransition>
                            </div>
                        );
                        break;
                    case MEDIA.GITHUB:
                        badges.push(

                            <div className="badges github" 
                                onMouseEnter={ (e) => this.toggleHoverMouseEnter(e, MEDIA.GITHUB)}
                                onMouseLeave={ (e) => this.toggleHoverMouseLeave(e, MEDIA.GITHUB)}
                                key={MEDIA.GITHUB}>
                                <a href="https://github.com/caiovini" 
                                target="_blank"
                                rel="noreferrer">
                                    <img className="badge-effect"
                                        src={GithubLogo}
                                        alt="Github"
                                    />
                                </a>
                                <ComponentTransition
                                    exitAnimation={AnimationTypes.fade.exit}
                                >
                                { this.state.showGithutPreviewLink ?  
                                    <Card style={{backgroundColor: "rgba(255, 255, 255, 0.9)", 
                                            opacity: 0.9, bottom: 150, right: 175, position: "fixed"}} 
                                        sx={{ maxWidth: 300,
                                        color: 'background.paper',
                                        boxShadow: 1,
                                        borderRadius: 1,
                                        p: 2,
                                        minWidth: 300,}}> 
                                        <CardMedia
                                            component="img"
                                            height="194"
                                            image={Selfie}
                                            alt="github_selfie"
                                        />
                                        <CardContent >
                                            <Typography variant="body2" color="text.primary">
                                                Please view my profile on github, this is where I put all
                                                my personal applications, including a few games which are one of my passions.<br/><br/>
                                                <a href="https://github.com/caiovini" 
                                                   target="_blank"
                                                   rel="noreferrer">
                                                Check it out here </a>
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                : "" }
                                </ComponentTransition>
                            </div>
                        );
                        break;
                    case MEDIA.XING:
                        badges.push(
                            
                            <div className="badges xing" 
                                onMouseEnter={ (e) => this.toggleHoverMouseEnter(e, MEDIA.XING)}
                                onMouseLeave={ (e) => this.toggleHoverMouseLeave(e, MEDIA.XING)}
                                key={MEDIA.XING} >
                                <a href="https://www.xing.com/profile/CaioVinicius_NascimentoReis" 
                                target="_blank"
                                rel="noreferrer">
                                    <img className="badge-effect"
                                        src={XingLogo}
                                        alt="Xing"
                                    />
                                    
                                </a>
                                <ComponentTransition
                                    exitAnimation={AnimationTypes.fade.exit}
                                >
                                { this.state.showXingPreviewLink ?  
                                    <Card style={{backgroundColor: "rgba(255, 255, 255, 0.9)",
                                            opacity: 0.9, right: 150, position: "fixed" }} 
                                        sx={{ maxWidth: 300,
                                        color: 'background.paper',
                                        boxShadow: 1,
                                        borderRadius: 1,
                                        p: 2,
                                        minWidth: 300,}} > 
                                        <CardMedia
                                            component="img"
                                            height="194"
                                            image={Xing_selfie}
                                            alt="xing_selfie"
                                        />
                                        <CardContent >
                                            <Typography variant="body2" color="text.primary">
                                                This is my xing, profile, feel free to have a look. I have all my experience listed here,
                                                xing is the largest online business network in Germany, Austria, and Switzerland.<br/><br/>
                                                <a href="https://www.xing.com/profile/CaioVinicius_NascimentoReis" 
                                                   target="_blank"
                                                   rel="noreferrer">
                                                Check it out here </a>
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                : "" }
                                </ComponentTransition>
                            </div>
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
                    <Card style={{backgroundColor: "rgba(0, 0, 0, 0)" , opacity: 0.9}} 
                          sx={{ maxWidth: 450,
                          color: 'background.paper',
                          boxShadow: 1,
                          borderRadius: 1,
                          p: 2,
                          minWidth: 300,}}>
                        <CardHeader
                        avatar={
                            <Avatar
                                alt="Caio Vinicius"
                                src={Selfie}
                                sx={{ width: 120, height: 120 }}
                            />   
                        }
                        
                          title="Caio Vinicius Nascimento Reis"
                        />
                        <CardContent >
                            <Typography>
                                    Salute,<br/>
                                    My name is Caio, I am a software engineer from Brazil.
                                    Please, hit the asteroids to reveal my social media links and feel free
                                    to have a look at my personal projects.
                            </Typography>
                        </CardContent>
                    </Card>
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