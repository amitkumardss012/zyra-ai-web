export type User = {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    gender: string | null;
    age: number | null;
    dob: string | null;
    preferredMode: string;
    skinType: string | null;
    skinConcerns: string[];
    beautyGoals: string[];
    height: number | null;
    weight: number | null;
    activityLevel: string | null;
    dietaryPreferences: string[];
    allergies: string[];
    healthGoals: string[];
    provider: string;
    isEmailVerified: boolean;
    isProfileCompleted: boolean;
    isActive: boolean;
    metadata: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}