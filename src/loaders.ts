import { loadImage } from "./utils";

export const loadTiles = async (): Promise<Record<number, HTMLImageElement>> => {
    const baseURL = "/assets/tiles";
    return {
            1: await loadImage(`${baseURL}/grass/1.png`),
            2: await loadImage(`${baseURL}/grass/2.png`),
            3: await loadImage(`${baseURL}/grass/3.png`),
            4: await loadImage(`${baseURL}/grass/4.png`),
            5: await loadImage(`${baseURL}/grass/5.png`),
            6: await loadImage(`${baseURL}/sand/1.png`),
            7: await loadImage(`${baseURL}/sand/2.png`),
            8: await loadImage(`${baseURL}/sand/3.png`),
            9: await loadImage(`${baseURL}/sand/4.png`),
            10: await loadImage(`${baseURL}/sand/5.png`),
            11: await loadImage(`${baseURL}/sand/6.png`),
            12: await loadImage(`${baseURL}/water/1.png`),
            13: await loadImage(`${baseURL}/borders/eroded/1.png`),
            14: await loadImage(`${baseURL}/borders/eroded/2.png`),
            15: await loadImage(`${baseURL}/borders/eroded/3.png`),
            16: await loadImage(`${baseURL}/borders/eroded/4.png`),
            17: await loadImage(`${baseURL}/borders/eroded/5.png`),
            18: await loadImage(`${baseURL}/borders/eroded/6.png`)
        };
}

export const loadWorldElements = async (): Promise<Record<number, HTMLImageElement>> => {
    const baseURL = "/assets/worldElements";
    return {
        1: await loadImage(`${baseURL}/rocks/1.png`),
        2: await loadImage(`${baseURL}/rocks/2.png`),
        3: await loadImage(`${baseURL}/rocks/3.png`),
        4: await loadImage(`${baseURL}/trees/1.png`),
        5: await loadImage(`${baseURL}/trees/2.png`),
        6: await loadImage(`${baseURL}/trees/3.png`),
    };
}

export const loadItems = async (): Promise<Record<number, HTMLImageElement>> => {
    const baseURL = "/assets/items";
    return {
        1: await loadImage(`${baseURL}/wood_pickaxe.png`),
        2: await loadImage(`${baseURL}/stone_pickaxe.png`),
        3: await loadImage(`${baseURL}/iron_pickaxe.png`),
        4: await loadImage(`${baseURL}/obamium_pickaxe.png`),
        5: await loadImage(`${baseURL}/beating_stick.png`),
        6: await loadImage(`${baseURL}/wood_stump.png`),
        7: await loadImage(`${baseURL}/rock.png`)
    }
}