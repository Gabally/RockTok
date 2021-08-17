export const loadImage = async (path: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = path;
        img.onload = () => {
            resolve(img);
        };
        img.onerror = (err) => reject(err);
    });
}

export const randomNumber = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max+1);
    return Math.floor(Math.random() * (max - min)) + min;
}

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
export const scaleArray = (array: number[][], factor: number): number[][] => {
	let scaled: number[][] = [];
	for(const row of array) {
		let x: number[] = [];
		for(const item of row) {
            x = x.concat(Array(factor).fill(item));
        }
		scaled = scaled.concat(Array(factor).fill(x));
	}
	return scaled;
}

export const sleep = (time: number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), time);
    });
}
