import { MAP_HEIGHT, MAP_WIDTH, TILE_DIMENSION } from "./constants";
import { point } from "./Game";

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

const randomNumber = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};

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
        newWorld.map = new Array(MAP_WIDTH);
        let noise = 0;
        for (let i = 0; i < newWorld.map.length; i++) {
            if (noise <= 0 && randomNumber(0, 5) === 4) {
                console.log("noise added");
                noise = 10;
            }
            noise -= 0.5;
            newWorld.map[i] = new Array(MAP_HEIGHT);
            for (let j = 0; j < MAP_HEIGHT; j++) {
                if (noise > 0) {
                    newWorld.map[i][j] = 3;
                } else {
                    newWorld.map[i][j] = randomNumber(1, 3);
                }
                if (randomNumber(0, 25) === 4) {
                    newWorld.rocks.push({
                        pos: {
                            x: i,
                            y: j
                        },
                        hp: 100
                    });
                }
                noise -= 0.5;
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
        if (pos.x < 0 || pos.x > MAP_WIDTH || pos.y < 0 || pos.y > MAP_HEIGHT) {
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