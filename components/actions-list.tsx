/**
 * Actions list component for displaying sustainability actions.
 *
 * This component renders a list of sustainability actions with glassmorphism
 * styling, including edit/delete functionality and loading states.
 */
"use client"

import { useState } from "react"
import { Edit, Trash2, Calendar, Award, Leaf, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { type SustainabilityAction, deleteAction, formatApiError } from "@/lib/api"

interface ActionsListProps {
  actions: SustainabilityAction[]
  isLoading: boolean
  onEdit: (action: SustainabilityAction) => void
  onDelete: () => void
}

/**
 * Loading skeleton for individual action items.
 * Displays glassmorphism placeholder content while data loads.
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
  )
}

/**
 * Individual action item component with glassmorphism styling.
 */
interface ActionItemProps {
  action: SustainabilityAction
  onEdit: (action: SustainabilityAction) => void
  onDelete: (id: number) => void
}

function ActionItem({ action, onEdit, onDelete }: ActionItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  /**
   * Format date for display in a user-friendly format.
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  /**
   * Get color scheme based on points value.
   * Higher points get more vibrant colors.
   */
  const getPointsColor = (points: number) => {
    if (points >= 50) return "bg-primary text-primary-foreground"
    if (points >= 25) return "bg-secondary text-secondary-foreground"
    return "bg-muted text-muted-foreground"
  }

  /**
   * Handle delete action with confirmation.
   */
  const handleDelete = () => {
    setIsDeleting(true)
    onDelete(action.id!)
  }

  return (
    <Card className="backdrop-blur-md bg-card/60 border border-border/20 shadow-lg hover:bg-card/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 mb-4 animate-slide-in-up group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {/* Action Content */}
          <div className="flex items-center gap-4 flex-1">
            {/* Action Icon */}
            <div className="p-3 bg-primary/20 rounded-full group-hover:bg-primary/30 transition-colors duration-300">
              <Leaf className="h-6 w-6 text-primary" />
            </div>

            {/* Action Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-lg mb-1 truncate">{action.action}</h3>
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

          {/* Action Controls */}
          <div className="flex items-center gap-3">
            {/* Points Badge */}
            <Badge className={`${getPointsColor(action.points)} font-bold px-3 py-1`}>+{action.points}</Badge>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 backdrop-blur-md bg-card/60 border border-border/20 hover:bg-card/80 transition-all duration-300 opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="backdrop-blur-md bg-card/80 border border-border/20 shadow-lg"
              >
                <DropdownMenuItem onClick={() => onEdit(action)} className="cursor-pointer">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Action
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="cursor-pointer text-destructive focus:text-destructive"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? "Deleting..." : "Delete Action"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Empty state component when no actions are available.
 */
function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="backdrop-blur-md bg-card/60 border border-border/20 shadow-lg rounded-2xl p-8 max-w-md mx-auto">
        <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-4">
          <Leaf className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Actions Yet</h3>
        <p className="text-muted-foreground text-balance">
          Start tracking your sustainability journey by adding your first environmental action.
        </p>
      </div>
    </div>
  )
}

/**
 * Main actions list component with glassmorphism design.
 * Handles loading states, empty states, and action management.
 */
export function ActionsList({ actions, isLoading, onEdit, onDelete }: ActionsListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [actionToDelete, setActionToDelete] = useState<SustainabilityAction | null>(null)

  const { toast } = useToast()

  /**
   * Handle action deletion with API call and error handling.
   */
  const handleDeleteAction = async (id: number) => {
    const action = actions.find((a) => a.id === id)
    if (!action) return

    setActionToDelete(action)
    setShowDeleteDialog(true)
  }

  /**
   * Confirm and execute action deletion.
   */
  const confirmDelete = async () => {
    if (!actionToDelete?.id) return

    try {
      setDeletingId(actionToDelete.id)
      await deleteAction(actionToDelete.id)
      onDelete()
      toast({
        title: "Action Deleted",
        description: `"${actionToDelete.action}" has been removed from your sustainability tracker.`,
      })
    } catch (error) {
      console.error("Failed to delete action:", error)
      toast({
        title: "Delete Failed",
        description: formatApiError(error),
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
      setShowDeleteDialog(false)
      setActionToDelete(null)
    }
  }

  /**
   * Cancel deletion and reset state.
   */
  const cancelDelete = () => {
    setShowDeleteDialog(false)
    setActionToDelete(null)
  }

  // Loading state with glassmorphism skeletons
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <ActionItemSkeleton key={index} />
        ))}
      </div>
    )
  }

  // Empty state when no actions exist
  if (actions.length === 0) {
    return <EmptyState />
  }

  // Sort actions by date (most recent first) and render list
  const sortedActions = [...actions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <>
      <div className="space-y-4">
        {sortedActions.map((action, index) => (
          <div key={action.id} className="animate-slide-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <ActionItem action={action} onEdit={onEdit} onDelete={handleDeleteAction} />
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="backdrop-blur-md bg-card/80 border border-border/20 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sustainability Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{actionToDelete?.action}"? This action cannot be undone and you will lose
              the {actionToDelete?.points} points associated with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete} disabled={deletingId !== null}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deletingId !== null}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingId === actionToDelete?.id ? "Deleting..." : "Delete Action"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
