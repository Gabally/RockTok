import { MAP_HEIGHT, MAP_WIDTH, TILE_DIMENSION, MAP_GENERATION_SCALE } from "./constants";
import { point } from "./Game";
import { randomNumber, scaleArray } from "./utils";
import { PerlinNoise } from "./PerlinNoise";

export interface chest {
    pos: point,
    items: number[]
}

export interface furnace {
    pos: point,
    in: {
        id: number,
        quantity: number,
    },
    out: {
        id: number,
        quantity: number
    },
    progress: number
}

export interface rock {
    pos: point,
    hp: number
}

export interface tree {
    pos: point,
    hp: number
}

export interface workbench {
    pos: point
}

export interface itemStack {
    id: number,
    quantity: number
}

export interface world {
    map: number[][],
    rocks: rock[],
    trees: tree[],
    chests: chest[],
    furnaces: furnace[],
    workbenches: workbench[],
    time: number,
    playerPosition: point,
    playerInventory: itemStack[],
    playerHP: number
}

const getRandomCoordinate = (): point => {
    return {
        x: randomNumber(0, MAP_WIDTH * TILE_DIMENSION),
        y: randomNumber(0, MAP_HEIGHT * TILE_DIMENSION)
    }
}

export const generateWorld = async (): Promise<world> => {
    return new Promise((resolve) => {
        let newWorld: world = {
            chests: [],
            furnaces: [],
            workbenches: [],
            rocks: [],
            trees: [],
            time: 8,
            playerPosition: getRandomCoordinate(),
            map: [],
            playerInventory: [],
            playerHP: 100
        };
        for (let i = 0; i < randomNumber(50, 300); i++) {
            let pos: point = getRandomCoordinate();
            if (newWorld.rocks.filter(r => r.pos.x == pos.x && r.pos.y == pos.y).length === 0 && newWorld.trees.filter(t => t.pos.x == pos.x && t.pos.y == pos.y).length === 0) {
                newWorld.trees.push({
                    pos: pos,
                    hp: 100
                });
            }
        }
        let cnv = document.createElement("canvas");
        cnv.width = MAP_WIDTH/MAP_GENERATION_SCALE;
        cnv.height = MAP_HEIGHT/MAP_GENERATION_SCALE;
        let tmpctx = cnv.getContext("2d");
        let noiseGenerator = new PerlinNoise();
        let smallMap = new Array(MAP_WIDTH/MAP_GENERATION_SCALE);
        for (let i = 0; i < smallMap.length; i++) {
            smallMap[i] = new Array(MAP_HEIGHT/MAP_GENERATION_SCALE);
            for (let j = 0; j < MAP_HEIGHT/MAP_GENERATION_SCALE; j++) {
                let noise = noiseGenerator.noise(i, j);
                //Makes the noise value between 0 and 1
                let terrainType = (noise + 1) / 2;
                if (terrainType < 0.3) {
                    smallMap[i][j] = 9;
                    tmpctx.fillStyle = "blue";
                    tmpctx.fillRect(i,j,1,1);
                } else if (terrainType < 0.7) {
                    smallMap[i][j] = 1;
                    tmpctx.fillStyle = "green";
                    tmpctx.fillRect(i,j,1,1);                    
                } else {
                    smallMap[i][j] = 6;
                    tmpctx.fillStyle = "yellow";
                    tmpctx.fillRect(i,j,1,1);
                }
                if (randomNumber(0, 50) === 4) {
                    newWorld.rocks.push({
                        pos: {
                            x: i,
                            y: j
                        },
                        hp: 100
                    });
                }
            }
        }
        let image = new Image();
        image.src = cnv.toDataURL("image/png");
        image.width = cnv.width*MAP_GENERATION_SCALE;
        image.height = cnv.height*MAP_GENERATION_SCALE;
        image.style.imageRendering = "pixelated";
        let w = window.open("https://gabally.net", 'map','width=700,height=500');
        w.document.write(image.outerHTML);
        w.focus();
        let scaledMap = scaleArray(smallMap, MAP_GENERATION_SCALE);
        newWorld.map = new Array(scaledMap.length);
        for(let i = 0; i < scaledMap.length; i++) {
            newWorld.map[i] = new Array(scaledMap[i].length);
            for(let j = 0; j < scaledMap[i].length; j++) {
                if (scaledMap[i][j] == 1) {
                    let choice = randomNumber(1, 100);
                    if (choice < 80) {
                        newWorld.map[i][j] = 1;
                    } else if (choice < 85) {
                        newWorld.map[i][j] = 2;
                    } else if (choice < 90) {
                        newWorld.map[i][j] = 3;
                    } else if (choice < 95) {
                        newWorld.map[i][j] = 4;
                    } else {
                        newWorld.map[i][j] = 5;
                    }
                } else if (scaledMap[i][j] == 6) {
                    let choice = randomNumber(1, 100);
                    if (choice < 45) {
                        newWorld.map[i][j] = 6;
                    } else if (choice < 70) {
                        newWorld.map[i][j] = 7;
                    } else {
                        newWorld.map[i][j] = 8;
                    }
                } else {
                    newWorld.map[i][j] = scaledMap[i][j];
                }
            }
        }
        resolve(newWorld);
    });
};

export class worldInterface {
    world: world;
    rocks: Record<string,number> = {};

    constructor(data: any) {
        this.world = <world>data;
        this.world.rocks.forEach(e => {
            this.rocks[e.pos.x + "|" + e.pos.y] = e.hp;
        });
        delete this.world.rocks;
    }

    getTile(pos: point): number {
        if (pos.x < 0 || pos.x > MAP_WIDTH-1 || pos.y < 0 || pos.y > MAP_HEIGHT-1) {
            return 0;
        }
        return this.world.map[pos.x][pos.y];
    }

    getPlayerPosition(): point {
        return this.world.playerPosition;
    }

    getRock(pos: point): boolean {
        return this.rocks[pos.x + "|" + pos.y] !== undefined;
    }
}