import { Sparkles } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="animate-fade-in bg-gradient-card rounded-2xl border border-border p-8 shadow-xl">
      <div className="text-center space-y-6">
        {/* Animated Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary animate-pulse-slow">
          <Sparkles className="h-8 w-8" />
        </div>

        {/* Loading Message */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            Creating your page...
          </h3>
          <p className="text-muted-foreground">
            Our AI is designing something beautiful for you
          </p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-3 max-w-xs mx-auto">
          <LoadingStep label="Analyzing your requirements" delay={0} />
          <LoadingStep label="Designing layout" delay={1} />
          <LoadingStep label="Generating content" delay={2} />
          <LoadingStep label="Publishing your page" delay={3} />
        </div>
      </div>
    </div>
  );
};

const LoadingStep = ({ label, delay }: { label: string; delay: number }) => {
  return (
    <div
      className="flex items-center gap-3 animate-fade-in"
      style={{ animationDelay: `${delay * 0.5}s`, animationFillMode: "backwards" }}
    >
      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
};

export default LoadingState;
