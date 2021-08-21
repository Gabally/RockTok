import { loadImage } from "./utils";

export const loadTiles = async (): Promise<Record<number, HTMLImageElement>> => {
    return {
            1: await loadImage("/assets/tiles/grass/1.png"),
            2: await loadImage("/assets/tiles/grass/2.png"),
            3: await loadImage("/assets/tiles/grass/3.png"),
            4: await loadImage("/assets/tiles/grass/4.png"),
            5: await loadImage("/assets/tiles/grass/5.png"),
            6: await loadImage("/assets/tiles/sand/1.png"),
            7: await loadImage("/assets/tiles/sand/2.png"),
            8: await loadImage("/assets/tiles/sand/3.png"),
            9: await loadImage("/assets/tiles/sand/4.png"),
            10: await loadImage("/assets/tiles/sand/5.png"),
            11: await loadImage("/assets/tiles/sand/6.png"),
            12: await loadImage("/assets/tiles/water/1.png"),
            13: await loadImage("/assets/tiles/borders/eroded/1.png"),
            14: await loadImage("/assets/tiles/borders/eroded/2.png"),
            15: await loadImage("/assets/tiles/borders/eroded/3.png"),
            16: await loadImage("/assets/tiles/borders/eroded/4.png"),
            17: await loadImage("/assets/tiles/borders/eroded/5.png"),
            18: await loadImage("/assets/tiles/borders/eroded/6.png")
        };
}

export const loadWorldElements = async (): Promise<Record<number, HTMLImageElement>> => {
    return {
        1: await loadImage("/assets/worldElements/rocks/1.png"),
        2: await loadImage("/assets/worldElements/rocks/2.png"),
        3: await loadImage("/assets/worldElements/rocks/3.png"),
        4: await loadImage("/assets/worldElements/trees/1.png"),
        5: await loadImage("/assets/worldElements/trees/2.png"),
        6: await loadImage("/assets/worldElements/trees/3.png"),
    };
}

export const loadItems = async (): Promise<Record<number, HTMLImageElement>> => {
    return {
        1: await loadImage("/assets/items/wood_pickaxe.png"),
        2: await loadImage("/assets/items/stone_pickaxe.png"),
        3: await loadImage("/assets/items/iron_pickaxe.png"),
        4: await loadImage("/assets/items/obamium_pickaxe.png")
    }
}