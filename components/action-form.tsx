/**
 * Action form component for creating and editing sustainability actions.
 *
 * This component provides a glassmorphism-styled modal form for adding
 * new actions or editing existing ones with comprehensive validation.
 */
"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { X, Save, Leaf, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  type SustainabilityAction,
  createAction,
  updateAction,
  formatApiError,
} from "@/lib/api";

interface ActionFormProps {
  action?: SustainabilityAction | null;
  onSave: () => void;
  onCancel: () => void;
}

/**
 * Form data interface for type safety and validation.
 */
interface FormData {
  action: string;
  date: string;
  points: number;
}

/**
 * Form validation errors interface.
 */
interface FormErrors {
  action?: string;
  date?: string;
  points?: string;
}

/**
 * Predefined action suggestions with points for quick selection.
 */
const ACTION_SUGGESTIONS = [
  { action: "Recycling plastic bottles", points: 25 },
  { action: "Using public transportation", points: 30 },
  { action: "Composting organic waste", points: 20 },
  { action: "Using reusable shopping bags", points: 15 },
  { action: "Switching to LED bulbs", points: 35 },
  { action: "Carpooling to work", points: 40 },
  { action: "Planting trees or flowers", points: 50 },
  { action: "Reducing water usage", points: 25 },
  { action: "Buying local produce", points: 30 },
  { action: "Using renewable energy", points: 60 },
];

/**
 * Main action form component with glassmorphism design.
 */
export function ActionForm({ action, onSave, onCancel }: ActionFormProps) {
  // Form state management
  const [formData, setFormData] = useState<FormData>({
    action: "",
    date: new Date().toISOString().split("T")[0], // Today's date as default
    points: 25,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { toast } = useToast();
  const isEditing = Boolean(action);

  /**
   * Initialize form data when editing an existing action.
   */
  useEffect(() => {
    if (action) {
      setFormData({
        action: action.action,
        date: action.date,
        points: action.points,
      });
    }
  }, [action]);

  /**
   * Validate form data and return any errors.
   */
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Validate action description
    if (!formData.action.trim()) {
      newErrors.action = "Action description is required";
    } else if (formData.action.trim().length < 3) {
      newErrors.action = "Action description must be at least 3 characters";
    } else if (formData.action.length > 255) {
      newErrors.action = "Action description must be less than 255 characters";
    }

    // Validate date
    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today

      if (selectedDate > today) {
        newErrors.date = "Action date cannot be in the future";
      }
    }

    // Validate points
    if (!formData.points || formData.points < 0) {
      newErrors.points = "Points must be a positive number";
    } else if (formData.points > 1000) {
      newErrors.points = "Points cannot exceed 1000 per action";
    }

    return newErrors;
  };

  /**
   * Handle form input changes with validation.
   */
  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  /**
   * Handle suggestion selection.
   */
  const handleSuggestionSelect = (suggestion: {
    action: string;
    points: number;
  }) => {
    setFormData((prev) => ({
      ...prev,
      action: suggestion.action,
      points: suggestion.points,
    }));
    setShowSuggestions(false);

    // Clear action error if it exists
    if (errors.action) {
      setErrors((prev) => ({ ...prev, action: undefined }));
    }
  };

  /**
   * Handle form submission with API call.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && action?.id) {
        // Update existing action
        await updateAction(action.id, formData);
      } else {
        // Create new action
        await createAction(formData);
      }

      onSave();
    } catch (error) {
      console.error("Failed to save action:", error);
      toast({
        title: "Save Failed",
        description: formatApiError(error),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Get points color based on value for visual feedback.
   */
  const getPointsColor = (points: number) => {
    if (points >= 50) return "text-primary";
    if (points >= 25) return "text-secondary";
    return "text-muted-foreground";
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="backdrop-blur-md bg-card/80 border border-border/20 shadow-xl max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-primary/20 rounded-full">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            {isEditing
              ? "Edit Sustainability Action"
              : "Add New Sustainability Action"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your sustainability action details below."
              : "Track a new environmental action and earn points for your sustainable choices."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Action Description Field */}
          <div className="space-y-2">
            <Label htmlFor="action" className="text-sm font-medium">
              Action Description *
            </Label>
            <div className="relative">
              <Textarea
                id="action"
                placeholder="Describe your sustainability action..."
                value={formData.action}
                onChange={(e) => handleInputChange("action", e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                className={`backdrop-blur-md bg-card/60 border border-border/20 min-h-[80px] resize-none ${
                  errors.action ? "border-destructive" : ""
                }`}
                maxLength={255}
              />
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                {formData.action.length}/255
              </div>
            </div>
            {errors.action && (
              <p className="text-sm text-destructive">{errors.action}</p>
            )}

            {/* Action Suggestions */}
            {showSuggestions && !isEditing && (
              <div className="backdrop-blur-md bg-card/60 border border-border/20 shadow-lg rounded-lg p-4 space-y-2 animate-slide-in-up">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-foreground">
                    Quick Suggestions
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSuggestions(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ACTION_SUGGESTIONS.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className="backdrop-blur-md bg-card/60 border border-border/20 hover:bg-card/80 hover:scale-105 transition-all duration-200 p-3 rounded-lg text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">
                          {suggestion.action}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          +{suggestion.points}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Date and Points Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date Field */}
            <div className="space-y-2">
              <Label
                htmlFor="date"
                className="text-sm font-medium flex items-center gap-1"
              >
                <Calendar className="h-4 w-4" />
                Action Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className={`backdrop-blur-md bg-card/60 border border-border/20 ${
                  errors.date ? "border-destructive" : ""
                }`}
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date}</p>
              )}
            </div>

            {/* Points Field */}
            <div className="space-y-2">
              <Label
                htmlFor="points"
                className="text-sm font-medium flex items-center gap-1"
              >
                <Award className="h-4 w-4" />
                Points Earned *
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="points"
                  type="number"
                  min="0"
                  max="1000"
                  value={formData.points}
                  onChange={(e) =>
                    handleInputChange(
                      "points",
                      Number.parseInt(e.target.value) || 0
                    )
                  }
                  className={`backdrop-blur-md bg-card/60 border border-border/20 ${
                    errors.points ? "border-destructive" : ""
                  }`}
                />
                <span
                  className={`text-sm font-medium ${getPointsColor(
                    formData.points
                  )}`}
                >
                  +{formData.points}
                </span>
              </div>
              {errors.points && (
                <p className="text-sm text-destructive">{errors.points}</p>
              )}
            </div>
          </div>

          {/* Points Guide */}
          <div className="backdrop-blur-md bg-card/60 border border-border/20 shadow-lg rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-2">
              Points Guide
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-muted rounded-full" />
                <span className="text-muted-foreground">
                  Small actions: 10-25 pts
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-secondary rounded-full" />
                <span className="text-muted-foreground">
                  Medium actions: 25-50 pts
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <span className="text-muted-foreground">
                  Major actions: 50+ pts
                </span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="backdrop-blur-md bg-card/60 border border-border/20 hover:bg-card/80 transition-all duration-300 flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? "Update Action" : "Create Action"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
