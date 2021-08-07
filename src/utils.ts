export const loadImage = async (path: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = path;
        img.onload = () => {
            resolve(img);
        };
        img.onerror = reject;
    });
}

export const randomNumber = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max+1);
    return Math.floor(Math.random() * (max - min)) + min;
};

export const loadTiles = async (): Promise<Record<number, HTMLImageElement>> => {
    let tileMap: Record<number, HTMLImageElement> = {
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
            11: await loadImage("/assets/tiles/sand/6.png")
        };
    return tileMap;
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
