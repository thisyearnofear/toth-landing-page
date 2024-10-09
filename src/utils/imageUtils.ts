export const loadImageWithFallback = (src: string, fallback: string = "🎩") => {
  return new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(fallback);
    img.src = src;
  });
};
