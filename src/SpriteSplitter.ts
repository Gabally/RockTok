import { loadImage } from "./utils";

export class SpriteSplitter {

    async split(image: string, frames: number, flipped = false): Promise<HTMLImageElement[]> {
            let img: HTMLImageElement = await loadImage(image);
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            let w = img.width / frames;
            let h = img.height;
            let start = 0;
            canvas.width = w;
            canvas.height = h;
            let images: HTMLImageElement[] = [];
            for (let i = 0; i < frames; i++) {
                ctx.imageSmoothingEnabled = false;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (flipped) {
                    ctx.save();
                    try {
                      ctx.translate(
                        w / 2,
                        h / 2
                      );
                      ctx.scale(-1, 1);
                      ctx.translate(
                        -(w / 2),
                        -(h / 2)
                      );
                      ctx.drawImage(img, start, 0, w, h, 0, 0, w, h);
                      ctx.restore();
                    } catch (err) {
                      ctx.restore();
                    }
                } else {
                    ctx.drawImage(img, start, 0, w, h, 0, 0, w, h);
                }
                images.push(await loadImage(canvas.toDataURL("data/png")));
                start += w;
            }
            return images;
    }
}