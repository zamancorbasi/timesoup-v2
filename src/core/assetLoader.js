export function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Image failed to load: " + src));

        img.src = src;
    });
}
