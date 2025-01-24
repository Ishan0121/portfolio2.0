import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRandomFavicon() {
const favnum = Math.floor(Math.random() * 4);
  const favlist = ["favicon0.png","favicon1.png", "favicon2.png", "favicon3.png"];
  return favlist[favnum];
}