import { OpenAI } from "openai";
import FirecrawlApp from '@mendable/firecrawl-js';

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export const firecrawl = new FirecrawlApp({
    apiKey: process.env.FIRECRAWL_API_KEY!,
});