"use client";

import { useState } from "react";
import {
  Edit,
  Trash2,
  Calendar,
  Award,
  Leaf,
  MoreVertical,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  type SustainabilityAction,
  deleteAction,
  formatApiError,
} from "@/lib/api";

interface ActionsListProps {
  actions: SustainabilityAction[];
  isLoading: boolean;
  onEdit: (action: SustainabilityAction) => void;
  onDelete: (deletedId: number) => void; // updated to remove deleted action
}

/**
 * Loading skeleton for individual action items.
 */
function ActionItemSkeleton() {
  return (
    <Card className="backdrop-blur-md bg-card/60 border border-border/20 shadow-lg mb-4">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Individual action item component with dropdown and delete.
 */
interface ActionItemProps {
  action: SustainabilityAction;
  onEdit: (action: SustainabilityAction) => void;
  onDelete: (id: number) => void;
}

function ActionItem({ action, onEdit, onDelete }: ActionItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPointsColor = (points: number) => {
    if (points >= 50) return "bg-primary text-primary-foreground";
    if (points >= 25) return "bg-secondary text-secondary-foreground";
    return "bg-muted text-muted-foreground";
  };

  const handleDelete = () => {
    onDelete(action.id!);
  };

  return (
    <Card className="backdrop-blur-md bg-card/60 border border-border/20 shadow-lg hover:bg-card/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 mb-4 animate-slide-in-up group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {/* Action Details */}
          <div className="flex items-center gap-4 flex-1">
            <div className="p-3 bg-primary/20 rounded-full group-hover:bg-primary/30 transition-colors duration-300">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-lg mb-1 truncate">
                {action.action}
              </h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(action.date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  <span>{action.points} points</span>
                </div>
              </div>
            </div>
          </div>

          {/* Points and Dropdown */}
          <div className="flex items-center gap-3">
            <Badge
              className={`${getPointsColor(action.points)} font-bold px-3 py-1`}
            >
              +{action.points}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hover:bg-primary/30 hover:border-primary/50 transition-all duration-300 opacity-80 group-hover:opacity-100 hover:shadow-lg focus:outline-none">
                  <MoreVertical className="h-4 w-4 text-primary" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="backdrop-blur-xl bg-background/95 border-2 border-primary/20 shadow-2xl min-w-[160px] p-1"
                sideOffset={5}
              >
                <DropdownMenuItem
                  onClick={() => onEdit(action)}
                  className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10 rounded-md px-3 py-2 transition-colors duration-200"
                >
                  <Edit className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium">Edit Action</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive rounded-md px-3 py-2 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  <span className="font-medium">Delete Action</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Empty state when no actions exist.
 */
function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="backdrop-blur-md bg-card/60 border border-border/20 shadow-lg rounded-2xl p-8 max-w-md mx-auto">
        <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-4">
          <Leaf className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Actions Yet
        </h3>
        <p className="text-muted-foreground text-balance mb-4">
          Start tracking your sustainability journey by adding your first
          environmental action.
        </p>
        <p className="text-sm text-primary font-medium">
          Click the "Add New Action" button above to get started!
        </p>
      </div>
    </div>
  );
}

/**
 * Main actions list with delete/edit.
 */
export function ActionsList({
  actions,
  isLoading,
  onEdit,
  onDelete,
}: ActionsListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [actionToDelete, setActionToDelete] =
    useState<SustainabilityAction | null>(null);

  const { toast } = useToast();

  const handleDeleteAction = (id: number) => {
    const action = actions.find((a) => a.id === id);
    if (!action) return;
    setActionToDelete(action);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!actionToDelete?.id) return;

    try {
      setDeletingId(actionToDelete.id);
      await deleteAction(actionToDelete.id);

      onDelete(actionToDelete.id);

      toast({
        title: "Action Deleted",
        description: `"${actionToDelete.action}" has been removed from your sustainability tracker.`,
      });
    } catch (error) {
      console.error("Failed to delete action:", error);
      toast({
        title: "Delete Failed",
        description: formatApiError(error),
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
      setShowDeleteDialog(false);
      setActionToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setActionToDelete(null);
    setDeletingId(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <ActionItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (actions.length === 0) return <EmptyState />;

  const sortedActions = [...actions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      <div className="space-y-4">
        {sortedActions.map((action, index) => (
          <div
            key={action.id}
            className="animate-slide-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ActionItem
              action={action}
              onEdit={onEdit}
              onDelete={handleDeleteAction}
            />
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="backdrop-blur-md bg-card/80 border border-border/20 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sustainability Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{actionToDelete?.action}"? This
              action cannot be undone and you will lose the{" "}
              {actionToDelete?.points} points associated with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={cancelDelete}
              disabled={deletingId !== null}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deletingId !== null}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingId === actionToDelete?.id
                ? "Deleting..."
                : "Delete Action"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
