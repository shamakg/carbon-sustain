/**
 * Main page component for the Sustainability Tracker application.
 *
 * This component serves as the primary interface for managing sustainability
 * actions, featuring a glassmorphism design with smooth animations and
 * comprehensive CRUD operations.
 */
"use client";

import { useState, useEffect } from "react";
import { Plus, Leaf, TrendingUp, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ActionsList } from "@/components/actions-list";
import { ActionForm } from "@/components/action-form";
import { StatsCards } from "@/components/stats-cards";
import {
  type SustainabilityAction,
  getAllActions,
  formatApiError,
} from "@/lib/api";

/**
 * Main application component with glassmorphism design and animations.
 * Manages the overall state and layout of the sustainability tracker.
 */
export default function SustainabilityTracker() {
  // State management for actions and UI
  const [actions, setActions] = useState<SustainabilityAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAction, setEditingAction] =
    useState<SustainabilityAction | null>(null);

  const { toast } = useToast();

  /**
   * Load all sustainability actions from the API.
   * Handles loading states and error management.
   */
  const loadActions = async () => {
    try {
      setIsLoading(true);
      console.log("[v0] Loading actions from API...");
      const fetchedActions = await getAllActions();
      console.log("[v0] Successfully loaded actions:", fetchedActions.length);
      setActions(fetchedActions);
    } catch (error) {
      console.error("[v0] Failed to load actions:", error);
      setActions([]);
      toast({
        title: "Error Loading Actions",
        description: formatApiError(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActions();
  }, []);

  /**
   * Handle successful action creation or update.
   * Refreshes the actions list and closes the form.
   */
  const handleActionSaved = () => {
    loadActions();
    setShowForm(false);
    setEditingAction(null);
    toast({
      title: "Success",
      description: editingAction
        ? "Action updated successfully!"
        : "Action created successfully!",
    });
  };

  /**
   * Handle action deletion.
   * Updates local state immediately without requiring page reload.
   */
  const handleActionDeleted = (deletedId: number) => {
    setActions((prevActions) =>
      prevActions.filter((action) => action.id !== deletedId)
    );
  };

  /**
   * Open the form for editing an existing action.
   */
  const handleEditAction = (action: SustainabilityAction) => {
    setEditingAction(action);
    setShowForm(true);
  };

  /**
   * Open the form for creating a new action.
   */
  const handleCreateAction = () => {
    console.log("[v0] Opening create action form");
    setEditingAction(null);
    setShowForm(true);
  };

  /**
   * Close the form and reset editing state.
   */
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAction(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Animated background elements for visual interest */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full animate-float" />
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-secondary/10 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-32 left-1/3 w-40 h-40 bg-accent/5 rounded-full animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section with Glassmorphism */}
        <header className="text-center mb-12 animate-slide-in-up">
          <div className="backdrop-blur-md bg-card/60 border border-border/20 rounded-2xl p-8 mb-8 shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-primary/20 rounded-full">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">
                Sustainability Tracker
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Track your environmental impact and earn points for sustainable
              actions. Every small step counts towards a greener future.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mt-6">
              <Button
                onClick={handleCreateAction}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group min-w-[160px]"
              >
                <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Add New Action
              </Button>

              <Badge
                variant="default"
                className="bg-primary text-primary-foreground font-medium text-sm px-4 py-2 shadow-sm border-0"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                {actions.length} Actions Tracked
              </Badge>
            </div>
          </div>
        </header>

        {/* Statistics Cards */}
        <div
          className="mb-8 animate-slide-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <StatsCards actions={actions} isLoading={isLoading} />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Actions List - Takes up 2 columns on large screens */}
          <div
            className="lg:col-span-2 animate-slide-in-right"
            style={{ animationDelay: "0.4s" }}
          >
            <Card className="backdrop-blur-md bg-card/60 border border-border/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Your Sustainability Actions
                </CardTitle>
                <CardDescription>
                  Manage and track all your environmental contributions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ActionsList
                  actions={actions}
                  isLoading={isLoading}
                  onEdit={handleEditAction}
                  onDelete={handleActionDeleted}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Content */}
          <div
            className="space-y-6 animate-slide-in-right"
            style={{ animationDelay: "0.6s" }}
          >
            {/* Quick Stats Card */}
            <Card className="backdrop-blur-md bg-card/60 border border-border/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-secondary" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Points
                  </span>
                  <Badge variant="outline" className="font-bold">
                    {actions.reduce((sum, action) => sum + action.points, 0)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    This Month
                  </span>
                  <Badge variant="outline">
                    {
                      actions.filter((action) => {
                        const actionDate = new Date(action.date);
                        const now = new Date();
                        return (
                          actionDate.getMonth() === now.getMonth() &&
                          actionDate.getFullYear() === now.getFullYear()
                        );
                      }).length
                    }
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Average Points
                  </span>
                  <Badge variant="outline">
                    {actions.length > 0
                      ? Math.round(
                          actions.reduce(
                            (sum, action) => sum + action.points,
                            0
                          ) / actions.length
                        )
                      : 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="backdrop-blur-md bg-card/60 border border-border/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">
                  💡 Sustainability Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm text-foreground">
                    <strong>Tip:</strong> Try to log at least one sustainable
                    action daily to build lasting habits.
                  </p>
                </div>
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <p className="text-sm text-foreground">
                    <strong>Goal:</strong> Aim for 100 points per week to make a
                    meaningful impact.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Form Modal */}
        {showForm && (
          <ActionForm
            action={editingAction}
            onSave={handleActionSaved}
            onCancel={handleCloseForm}
          />
        )}
      </div>
    </div>
  );
}
