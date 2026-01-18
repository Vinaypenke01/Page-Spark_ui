import type { OccasionType } from "@/constants/occasionFields";

export interface StructuredFormData {
    // Step 1
    occasion: OccasionType;
    email: string;

    // Step 2: Common
    title?: string;
    names?: string;
    description?: string;
    date?: string;
    time?: string;
    location?: string;
    contact?: string;

    // Design
    theme: string;
    font?: string;
    language?: string;
    color?: string;

    // Step 3: Dynamic
    // We use a flexible record here since keys vary by occasion
    specific_fields: Record<string, any>;
}
