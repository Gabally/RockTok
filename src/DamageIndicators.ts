import { point, direction } from "./Game";
import { randomNumber } from "./utils";

interface damageNumber {
    pos: point,
    value: number,
    timeElapsed: number,
    upForce: number,
    direction: direction
}

export class DamageIndicatorsSystem {
    damageIndicators: damageNumber[];
    animationSpeed: number;
    
    constructor() {
        this.damageIndicators = [];
        this.animationSpeed = 0.6;
    }

    update(deltaTime: number) {
        for (let i = 0; i < this.damageIndicators.length; i++) {
            if (this.damageIndicators[i].direction == direction.Left) {
                this.damageIndicators[i].pos.x -= this.animationSpeed * deltaTime;
            } else {
                this.damageIndicators[i].pos.x += this.animationSpeed * deltaTime;
            }
            if (this.damageIndicators[i].upForce > 0) {
                this.damageIndicators[i].pos.y -= this.animationSpeed * deltaTime;
                this.damageIndicators[i].upForce -= 1;
            } else {
                this.damageIndicators[i].pos.y += this.animationSpeed * deltaTime;
            }
            
            this.damageIndicators[i].timeElapsed += deltaTime;
        }
        this.damageIndicators = this.damageIndicators.filter(d => d.timeElapsed < 60);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.font = "15px KarmaticArcade";
        ctx.textAlign = "center";
        for (let i = 0; i < this.damageIndicators.length; i++) {
            ctx.fillText(`${this.damageIndicators[i].value}`, this.damageIndicators[i].pos.x, this.damageIndicators[i].pos.y);   
        }
        ctx.restore();
    }

    addIndicator(value: number, pos: point) {
        this.damageIndicators.push({
            pos: pos,
            value: value,
            timeElapsed: 0,
            upForce: randomNumber(5, 13),
            direction: randomNumber(2, 3)
        });
    }
}