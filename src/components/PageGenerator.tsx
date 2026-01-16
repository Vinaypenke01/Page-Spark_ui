import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Mail, AlertCircle } from "lucide-react";

interface PageGeneratorProps {
  onGenerate: (data: {
    prompt: string;
    email: string;
    pageType: string;
    theme: string;
  }) => void;
  isLoading: boolean;
}

const PageGenerator = ({ onGenerate, isLoading }: PageGeneratorProps) => {
  const [prompt, setPrompt] = useState("");
  const [email, setEmail] = useState("");
  const [pageType, setPageType] = useState("");
  const [theme, setTheme] = useState("");
  const [errors, setErrors] = useState<{ prompt?: string; email?: string }>({});

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { prompt?: string; email?: string } = {};

    if (!prompt.trim()) {
      newErrors.prompt = "Please describe the page you want to create";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onGenerate({ prompt, email, pageType, theme });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Prompt Input */}
      <div className="space-y-2">
        <Label htmlFor="prompt" className="text-base font-medium">
          What would you like to create?
        </Label>
        <Textarea
          id="prompt"
          placeholder="Describe the page you want to create… e.g., 'A birthday invitation page for my daughter's 5th birthday party with unicorn theme, date, time, and RSVP button'"
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            if (errors.prompt) setErrors((prev) => ({ ...prev, prompt: undefined }));
          }}
          className={`min-h-[160px] text-base ${errors.prompt ? "border-destructive focus-visible:ring-destructive" : ""}`}
        />
        {errors.prompt && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {errors.prompt}
          </div>
        )}
      </div>

      {/* Email Input */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-base font-medium flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Your Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        <p className="text-sm text-muted-foreground">
          We'll send you the live link and any updates about your page
        </p>
        {errors.email && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {errors.email}
          </div>
        )}
      </div>

      {/* Optional Selects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pageType" className="text-sm font-medium text-muted-foreground">
            Page Type (Optional)
          </Label>
          <Select value={pageType} onValueChange={setPageType}>
            <SelectTrigger id="pageType">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="birthday">Birthday Invitation</SelectItem>
              <SelectItem value="event">Event Page</SelectItem>
              <SelectItem value="landing">Landing Page</SelectItem>
              <SelectItem value="portfolio">Portfolio</SelectItem>
              <SelectItem value="announcement">Announcement</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="theme" className="text-sm font-medium text-muted-foreground">
            Theme (Optional)
          </Label>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger id="theme">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light & Clean</SelectItem>
              <SelectItem value="dark">Dark & Bold</SelectItem>
              <SelectItem value="colorful">Colorful & Fun</SelectItem>
              <SelectItem value="modern">Modern & Minimal</SelectItem>
              <SelectItem value="elegant">Elegant & Classic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="hero"
        size="xl"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            Generating your page...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Generate Live Page
          </>
        )}
      </Button>
    </form>
  );
};

export default PageGenerator;
