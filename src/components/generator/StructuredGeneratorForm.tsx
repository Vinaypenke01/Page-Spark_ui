import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Sparkles, ArrowRight, ArrowLeft, Check, Calendar, MapPin, Clock, Edit, Eye } from "lucide-react";
import {
    OCCASIONS,
    COMMON_FIELDS,
    OCCASION_FIELDS,
    DESIGN_PREFERENCES,
    type OccasionType,
    type FieldDefinition,
} from "@/constants/occasionFields";
import type { StructuredFormData } from "@/types/generator";

interface StructuredGeneratorFormProps {
    onGenerate: (data: StructuredFormData) => void;
    isLoading: boolean;
}

const StructuredGeneratorForm = ({ onGenerate, isLoading }: StructuredGeneratorFormProps) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<StructuredFormData>>({
        specific_fields: {},
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isPromptEditable, setIsPromptEditable] = useState(false);

    const updateField = (field: keyof StructuredFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const updateSpecificField = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            specific_fields: { ...prev.specific_fields, [field]: value },
        }));
    };

    const generatePromptPreview = () => {
        const occasion = formData.occasion?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Generic';
        const title = formData.title || '';
        const theme = formData.theme?.replace(/\b\w/g, l => l.toUpperCase()) || 'Modern';
        const font = formData.font || 'sans';
        const language = formData.language || 'english';

        const promptParts = [
            `You are a professional web designer and frontend developer.`,
            `Create a visually attractive, single-page ${occasion} website.`,
            ``,
            `Page Title: ${title}`,
            `Design Theme: ${theme}`,
            `Font Style: ${font === 'handwritten' ? 'Handwritten/Playful' : font === 'serif' ? 'Serif (Classic)' : 'Sans-serif (Clean)'}`,
            `Language: ${language.charAt(0).toUpperCase() + language.slice(1)}`,
            ``,
            `### Content Details`
        ];

        // Add common fields
        const excludeKeys = ['occasion', 'email', 'theme', 'title', 'specific_fields', 'font', 'language', 'color', 'generatedPrompt'];
        for (const [key, value] of Object.entries(formData)) {
            if (!excludeKeys.includes(key) && value) {
                const readableKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                promptParts.push(`- ${readableKey}: ${value}`);
            }
        }

        // Add occasion-specific fields
        const specificFields = formData.specific_fields || {};
        if (Object.keys(specificFields).length > 0) {
            promptParts.push('');
            promptParts.push('### Occasion-Specific Details');
            for (const [key, value] of Object.entries(specificFields)) {
                if (value && value !== 'undefined') {
                    const readableKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    promptParts.push(`- ${readableKey}: ${value}`);
                }
            }
        }

        // Add design and technical requirements
        promptParts.push(
            '',
            '### Design & Layout Instructions',
            `- Use a ${theme.toLowerCase()} visual style suitable for a ${occasion}.`,
            '- Follow this section order:',
            '  1. Hero section (title, short message)',
            '  2. Event details (date, time, venue)',
            '  3. Additional information / special message',
            '  4. Contact or RSVP section',
            '- Use clean spacing, clear typography, and balanced layout.',
            '- Add subtle decorative elements relevant to the occasion.',
            '',
            '### Technical Requirements',
            '- Output ONLY valid HTML with Tailwind CSS utility classes.',
            '- Use semantic HTML5 elements.',
            '- Include Tailwind CSS CDN in the <head> section: <script src="https://cdn.tailwindcss.com"></script>',
            '- Use ONLY Tailwind CSS utility classes for styling - NO custom CSS or <style> tags.',
            '- Do NOT include explanations, markdown, or comments.',
            '- Do NOT include external libraries or images (except Tailwind CDN).',
            '- Do NOT include any JavaScript code.',
            '- The page must be fully responsive using Tailwind\'s responsive classes.',
            '- Use Tailwind\'s color palette and spacing system.',
            '- Example: Use classes like \'bg-blue-500\', \'text-white\', \'p-4\', \'rounded-lg\', etc.'
        );

        return promptParts.join('\n');
    };

    const validateStep = (currentStep: number): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        if (currentStep === 1) {
            if (!formData.occasion) {
                newErrors.occasion = "Please select an occasion";
                isValid = false;
            }
        } else if (currentStep === 2) {
            if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = "Valid email is required";
                isValid = false;
            }
            COMMON_FIELDS.forEach((field) => {
                if (field.required && !formData[field.id as keyof StructuredFormData]) {
                    newErrors[field.id] = `${field.label} is required`;
                    isValid = false;
                }
            });
            if (!formData.theme) {
                newErrors.theme = "Please select a theme";
                isValid = false;
            }
        } else if (currentStep === 3) {
            if (formData.occasion) {
                const fields = OCCASION_FIELDS[formData.occasion];
                fields.forEach((field) => {
                    if (field.required && !formData.specific_fields?.[field.id]) {
                        newErrors[field.id] = `${field.label} is required`;
                        isValid = false;
                    }
                });
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = async () => {
        if (validateStep(step)) {
            // Generate AI prompt when moving from step 3 to step 4
            if (step === 3) {
                setIsPromptEditable(false); // Reset to readonly mode
                setStep((prev) => prev + 1); // Move to step 4 first
                window.scrollTo({ top: 0, behavior: "smooth" });

                // Show loading state while generating prompt
                setFormData((prev) => ({ ...prev, generatedPrompt: 'Generating AI-optimized prompt...' }));

                try {
                    // Call backend to generate AI prompt
                    const { api } = await import('@/services/api');
                    const response = await api.pages.generatePrompt(formData);

                    // Set the AI-generated prompt
                    setFormData((prev) => ({ ...prev, generatedPrompt: response.generated_prompt }));
                } catch (error) {
                    console.error('Failed to generate AI prompt:', error);
                    // Show error - Groq should always work if API key is valid
                    setFormData((prev) => ({
                        ...prev,
                        generatedPrompt: `❌ Error: ${error instanceof Error ? error.message : 'Failed to generate prompt'}.\n\nPlease check:\n1. Your Groq API key is set correctly\n2. You have internet connection\n3. Groq service is available`
                    }));
                }
            } else {
                setStep((prev) => prev + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    };

    const handleBack = () => {
        setStep((prev) => prev - 1);
    };

    const handleSubmit = () => {
        if (validateStep(4)) {
            // Use the generated or edited prompt
            const finalData = {
                ...formData,
                prompt: formData.generatedPrompt || generatePromptPreview()
            } as StructuredFormData;
            onGenerate(finalData);
        }
    };

    const renderField = (field: FieldDefinition, value: any, onChange: (val: any) => void) => {
        return (
            <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>
                    {field.label} {field.required && <span className="text-destructive">*</span>}
                </Label>

                {field.type === "textarea" ? (
                    <Textarea
                        id={field.id}
                        placeholder={field.placeholder}
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        className={errors[field.id] ? "border-destructive" : ""}
                    />
                ) : field.type === "select" ? (
                    <Select value={value || ""} onValueChange={onChange}>
                        <SelectTrigger id={field.id} className={errors[field.id] ? "border-destructive" : ""}>
                            <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options?.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                    {opt}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ) : (
                    <Input
                        id={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        className={errors[field.id] ? "border-destructive" : ""}
                    />
                )}

                {errors[field.id] && (
                    <p className="text-xs text-destructive">{errors[field.id]}</p>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {/* Progress Indicator */}
            <div className="flex items-center justify-between px-2 mb-8">
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex flex-col items-center relative z-10">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${step >= s
                                ? "bg-primary text-primary-foreground shadow-lg scale-110"
                                : "bg-muted text-muted-foreground border-2 border-border"
                                }`}
                        >
                            {step > s ? <Check className="h-6 w-6" /> : s}
                        </div>
                        <span className="text-xs mt-2 font-medium text-muted-foreground hidden sm:block">
                            {s === 1 ? "Occasion" : s === 2 ? "Details" : s === 3 ? "Specifics" : "Preview"}
                        </span>
                    </div>
                ))}
                {/* Connecting Line */}
                <div className="absolute left-0 right-0 top-5 h-[2px] bg-muted -z-0 mx-8 md:mx-16" />
                <div
                    className="absolute left-0 top-5 h-[2px] bg-primary transition-all duration-500 mx-8 md:mx-16 -z-0"
                    style={{ width: `${((step - 1) / 3) * 100}%` }}
                />
            </div>

            {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold mb-2">What are you celebrating?</h2>
                        <p className="text-muted-foreground">Choose an occasion to get started</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {OCCASIONS.map((occ) => (
                            <Card
                                key={occ.value}
                                className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${formData.occasion === occ.value
                                    ? "border-primary ring-2 ring-primary ring-offset-2 bg-primary/5"
                                    : "border-border"
                                    }`}
                                onClick={() => {
                                    updateField("occasion", occ.value);
                                    setErrors((prev) => {
                                        const newErrors = { ...prev };
                                        delete newErrors.occasion;
                                        return newErrors;
                                    });
                                }}
                            >
                                <div className="text-center font-medium">{occ.label}</div>
                            </Card>
                        ))}
                    </div>
                    {errors.occasion && (
                        <p className="text-center text-destructive font-medium mt-4">{errors.occasion}</p>
                    )}
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold">Basic Details</h2>
                        <p className="text-muted-foreground">Tell us the essentials</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Email - Always first */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="email">Your Email <span className="text-destructive">*</span></Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@email.com"
                                value={formData.email || ""}
                                onChange={(e) => updateField("email", e.target.value)}
                                className={errors.email ? "border-destructive" : ""}
                            />
                            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                        </div>

                        {COMMON_FIELDS.map((field) => (
                            <div key={field.id} className={field.type === 'textarea' ? "md:col-span-2" : ""}>
                                {renderField(
                                    field,
                                    formData[field.id as keyof StructuredFormData],
                                    (val) => updateField(field.id as keyof StructuredFormData, val)
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-6 mt-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" /> Design Preferences
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label>Theme <span className="text-destructive">*</span></Label>
                                <Select value={formData.theme || ""} onValueChange={(val) => updateField("theme", val)}>
                                    <SelectTrigger className={errors.theme ? "border-destructive" : ""}>
                                        <SelectValue placeholder="Select Theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DESIGN_PREFERENCES.themes.map((t) => (
                                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.theme && <p className="text-xs text-destructive">{errors.theme}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Language</Label>
                                <Select value={formData.language || "english"} onValueChange={(val) => updateField("language", val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DESIGN_PREFERENCES.languages.map((l) => (
                                            <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Font Style</Label>
                                <Select value={formData.font || "sans"} onValueChange={(val) => updateField("font", val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Font" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DESIGN_PREFERENCES.fonts.map((f) => (
                                            <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {step === 3 && formData.occasion && (
                <div className="space-y-6 animate-fade-in">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold">Specific Details</h2>
                        <p className="text-muted-foreground">
                            Customize your {OCCASIONS.find(o => o.value === formData.occasion)?.label} page
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/30 p-6 rounded-xl border border-border">
                        {OCCASION_FIELDS[formData.occasion].map((field) => (
                            <div key={field.id} className={field.type === 'textarea' ? "md:col-span-2" : ""}>
                                {renderField(
                                    field,
                                    formData.specific_fields?.[field.id],
                                    (val) => updateSpecificField(field.id, val)
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                            <Eye className="h-6 w-6 text-primary" />
                            Review Your Prompt
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            This is the AI-optimized prompt that will generate your page. You can edit it if needed.
                        </p>
                    </div>

                    <Card className="p-6 bg-muted/30 border-2 border-primary/20">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-base font-semibold">Generated Prompt</Label>
                                <Button
                                    variant={isPromptEditable ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setIsPromptEditable(!isPromptEditable)}
                                    className="gap-2"
                                >
                                    {isPromptEditable ? (
                                        <>
                                            <Eye className="h-4 w-4" /> View Mode
                                        </>
                                    ) : (
                                        <>
                                            <Edit className="h-4 w-4" /> Edit Prompt
                                        </>
                                    )}
                                </Button>
                            </div>

                            <Textarea
                                value={formData.generatedPrompt || ''}
                                onChange={(e) => updateField('generatedPrompt', e.target.value)}
                                readOnly={!isPromptEditable}
                                className={`min-h-[400px] font-mono text-sm ${isPromptEditable
                                    ? 'bg-background border-primary'
                                    : 'bg-muted/50 cursor-default'
                                    }`}
                                placeholder="Generating prompt..."
                            />

                            {isPromptEditable && (
                                <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-md">
                                    <div className="text-amber-600 dark:text-amber-500 mt-0.5">⚠️</div>
                                    <p className="text-sm text-amber-800 dark:text-amber-300">
                                        <strong>Tip:</strong> Be specific and clear in your edits. The AI will follow your instructions exactly.
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            )}

            {/* Navigation Actions */}
            <div className="flex items-center justify-between pt-8 border-t border-border mt-8">
                <div>
                    {step > 1 && (
                        <Button variant="outline" onClick={handleBack} disabled={isLoading}>
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back
                        </Button>
                    )}
                </div>

                <div>
                    {step < 4 ? (
                        <Button onClick={handleNext} className="px-8">
                            {step === 3 ? 'Generate Preview' : 'Next Step'} <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            variant="hero"
                            size="lg"
                            className="px-8 shadow-lg shadow-primary/25"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>Generating...</>
                            ) : (
                                <>
                                    <Sparkles className="h-5 w-5 mr-2" />
                                    Continue & Generate Page
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StructuredGeneratorForm;
