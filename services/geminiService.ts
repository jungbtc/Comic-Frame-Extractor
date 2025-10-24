import { BoundingBox } from '../types';

const GUTTER_THRESHOLD = 245; // Pixels with R, G, and B values all above this are considered gutter
const MIN_PANEL_AREA_PERCENTAGE = 0.01; // Panels must be at least 1% of the total image area

const isGutter = (r: number, g: number, b: number): boolean => {
    return r > GUTTER_THRESHOLD && g > GUTTER_THRESHOLD && b > GUTTER_THRESHOLD;
};

/**
 * Segments a comic image into individual frames by detecting the gutters (white space) between them.
 * This runs entirely in the browser using a canvas-based connected-component labeling algorithm.
 * @param imageUrl The URL of the image to process. Can be a blob URL from a file upload.
 * @returns A promise that resolves to an array of BoundingBox objects for each detected frame.
 */
export const segmentFrames = (imageUrl: string): Promise<BoundingBox[]> => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous'; // Support for cross-origin images if ever needed
        image.src = imageUrl;

        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) {
                return reject(new Error('Could not get canvas context'));
            }

            const { width, height } = image;
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(image, 0, 0);

            const imageData = ctx.getImageData(0, 0, width, height);
            const { data } = imageData;
            
            const visited = new Array(width * height).fill(false);
            const boxes: BoundingBox[] = [];

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const i = (y * width + x);
                    if (visited[i]) continue;

                    const r = data[i * 4];
                    const g = data[i * 4 + 1];
                    const b = data[i * 4 + 2];

                    if (isGutter(r, g, b)) {
                        visited[i] = true;
                        continue;
                    }

                    // Found an unvisited, non-gutter pixel - start of a new panel
                    const queue: [number, number][] = [[x, y]];
                    visited[i] = true;
                    
                    let minX = x, maxX = x, minY = y, maxY = y;

                    // Use Breadth-First Search (BFS) to find all connected non-gutter pixels
                    while (queue.length > 0) {
                        const [cx, cy] = queue.shift()!;

                        minX = Math.min(minX, cx);
                        maxX = Math.max(maxX, cx);
                        minY = Math.min(minY, cy);
                        maxY = Math.max(maxY, cy);

                        const neighbors: [number, number][] = [ [cx, cy - 1], [cx, cy + 1], [cx - 1, cy], [cx + 1, cy] ];

                        for (const [nx, ny] of neighbors) {
                            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                                const ni = (ny * width + nx);
                                if (!visited[ni]) {
                                    visited[ni] = true; // Mark as visited immediately to avoid re-queuing
                                    const nr = data[ni * 4];
                                    const ng = data[ni * 4 + 1];
                                    const nb = data[ni * 4 + 2];
                                    if (!isGutter(nr, ng, nb)) {
                                        queue.push([nx, ny]);
                                    }
                                }
                            }
                        }
                    }
                    
                    const boxWidth = maxX - minX + 1;
                    const boxHeight = maxY - minY + 1;
                    
                    // Filter out small noise blobs
                    if ((boxWidth * boxHeight) / (width * height) > MIN_PANEL_AREA_PERCENTAGE) {
                         boxes.push({
                            x: minX / width,
                            y: minY / height,
                            width: boxWidth / width,
                            height: boxHeight / height,
                        });
                    }
                }
            }
            
            // Sort boxes for proper reading order (top-to-bottom, then left-to-right)
            boxes.sort((a, b) => {
                const yDifference = a.y - b.y;
                if (Math.abs(yDifference) > 0.05) { // If y-positions are significantly different
                    return yDifference;
                }
                return a.x - b.x; // Otherwise, sort by x
            });

            resolve(boxes);
        };

        image.onerror = () => {
            reject(new Error('Failed to load image for processing.'));
        };
    });
};
