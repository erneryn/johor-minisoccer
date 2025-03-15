import configData from './config.json';

export const { features, cards, promotions } = configData;

// Type definitions
export interface Feature {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface Card {
  id: number;
  mainTitle?: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  image: string;
}

export interface Promotion {
  id: number;
  mainTitle?: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  image: string;
  badge?: string;
} 