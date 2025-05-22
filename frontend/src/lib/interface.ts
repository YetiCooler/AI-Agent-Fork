import { Dispatch, SetStateAction } from "react";

export interface IUser {
    email: string;
    pointsUsed: number;
    pointsResetDate: Date;
    currentplan: string;
    disableModel: string[];
    planStartDate: Date;
    planEndDate: Date;
    requestPlanId: string;
    subscriptionId: string;
    subscriptionStatus: string;
    stripeCustomerId: string;
}

export interface User {
    email: string;
    pointsUsed: number;
    pointsResetDate: Date;
    currentplan: ISubscriptionPlan;
    disableModel: string[];
    planStartDate: Date;
    planEndDate: Date;
    requestPlanId: string;
    subscriptionId: string;
    subscriptionStatus: string;
    stripeCustomerId: string;
}

export interface ISubscriptionPlan {
    _id: string;
    name: string;
    type: string;
    price: number;
    description: string;
    features: string[];
    isYearlyPlan: boolean;
    priceId: string;
    productId: string;
    points: number;
    bonusPoints: number;
    activeModels: string[];
}

export interface IResearchLog {
    title: string;
    researchSteps: IResearchStep[];
    sources: ISource[];
    learnings: string[];
}

export interface IResearchStep {
    type: number;
    researchStep: string;
}

export interface ISource {
    url: string;
    content?: string;
    image: string;
    title: string;
}

export interface IFileWithUrl {
    file: File;
    url: string;
}

export interface ChatHistory {
    id: string;
    title: string;
    chats: ChatLog[];
    loading?: boolean;
}

export interface ChatLog {
    prompt: string;
    response: string | null;
    timestamp: string | null;
    inputToken?: number;
    outputToken?: number;
    outputTime?: number;
    totalTime?: number;
    chatType: number;
    fileUrls: string[];
    model: string;
    points: number;
}

export interface IChatCompletionChoice {
    message?: { content?: string | null };
    usage?: { prompt_tokens: number, completion_tokens: number, total_tokens: number };
}

export interface UserContextType {
    profile: User | null;
    setProfile: Dispatch<SetStateAction<User | null>>;
    isLoading: boolean;
    signOut: () => void;
}

export interface IAI {
    _id: string;
    name: string;
    inputCost: number;
    outputCost: number;
    multiplier: number;
    provider: string;
    model: string;
    type: string;
}