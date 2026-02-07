import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/ui/data-table";
import {
  AlertTriangle,
  Hash,
  Clock,
  Flame,
  Plus,
  BotMessageSquare,
  Loader2,
} from "lucide-react";
import { ErrorsAreaChart } from "./area-chart";
import { createErrorColumns } from "./errors-columns";
import {
  errorsQueries,
  useCreateError,
  useUpdateError,
  useDeleteError,
  useGetAdvice,
} from "@/services/queries";
import type { ErrorEntry } from "@/types/error";

export function DashboardOverview() {
  const { data: errors = [], isLoading } = useQuery(errorsQueries.list());

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingError, setEditingError] = useState<ErrorEntry | null>(null);
  const [isAdviceOpen, setIsAdviceOpen] = useState(false);

  const [formData, setFormData] = useState("");
  const [formCounter, setFormCounter] = useState(0);

  const createMutation = useCreateError();
  const updateMutation = useUpdateError();
  const deleteMutation = useDeleteError();
  const adviceMutation = useGetAdvice();

  // Computed stats
  const stats = useMemo(() => {
    if (errors.length === 0) {
      return {
        totalErrors: 0,
        totalOccurrences: 0,
        mostRecent: "N/A",
        mostFrequent: "N/A",
      };
    }

    const totalOccurrences = errors.reduce((sum, e) => sum + e.counter, 0);

    const sorted = [...errors].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const mostRecent = new Date(sorted[0].createdAt).toLocaleDateString();

    const mostFrequent = [...errors].sort(
      (a, b) => b.counter - a.counter
    )[0];
    const frequentLabel =
      typeof mostFrequent.data === "string"
        ? mostFrequent.data.slice(0, 30)
        : JSON.stringify(mostFrequent.data).slice(0, 30);

    return {
      totalErrors: errors.length,
      totalOccurrences,
      mostRecent,
      mostFrequent: frequentLabel + (frequentLabel.length >= 30 ? "..." : ""),
    };
  }, [errors]);

  const statCards = [
    {
      title: "Total Errors",
      value: stats.totalErrors.toString(),
      icon: AlertTriangle,
    },
    {
      title: "Total Occurrences",
      value: stats.totalOccurrences.toString(),
      icon: Hash,
    },
    {
      title: "Most Recent",
      value: stats.mostRecent,
      icon: Clock,
    },
    {
      title: "Most Frequent",
      value: stats.mostFrequent,
      icon: Flame,
    },
  ];

  // Handlers
  const handleOpenAdd = () => {
    setEditingError(null);
    setFormData("");
    setFormCounter(0);
    setIsAddOpen(true);
  };

  const handleOpenEdit = (error: ErrorEntry) => {
    setEditingError(error);
    setFormData(typeof error.data === "string" ? error.data : JSON.stringify(error.data));
    setFormCounter(error.counter);
    setIsAddOpen(true);
  };

  const handleSave = () => {
    if (editingError) {
      updateMutation.mutate(
        { id: editingError.id, input: { data: formData, counter: formCounter } },
        { onSuccess: () => setIsAddOpen(false) }
      );
    } else {
      createMutation.mutate(
        { data: formData, counter: formCounter },
        { onSuccess: () => setIsAddOpen(false) }
      );
    }
  };

  const handleDelete = (error: ErrorEntry) => {
    deleteMutation.mutate(error.id);
  };

  const handleAdvice = () => {
    adviceMutation.mutate(undefined, {
      onSuccess: () => setIsAdviceOpen(true),
    });
  };

  const columns = useMemo(
    () =>
      createErrorColumns({
        onEdit: handleOpenEdit,
        onDelete: handleDelete,
      }),
    []
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Error Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and analyze application errors from Sentry.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAdvice} disabled={adviceMutation.isPending || errors.length === 0}>
            {adviceMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <BotMessageSquare className="mr-2 h-4 w-4" />
            )}
            AI Analysis
          </Button>
          <Button onClick={handleOpenAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Error
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate" title={stat.value}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Errors Over Time</CardTitle>
          <CardDescription>
            Error count and total occurrences grouped by date
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ErrorsAreaChart errors={errors} />
        </CardContent>
      </Card>

      {/* Errors Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Errors</CardTitle>
          <CardDescription>
            {errors.length} error{errors.length !== 1 ? "s" : ""} tracked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={errors} searchKey="data" />
        </CardContent>
      </Card>

      {/* Add / Edit Error Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingError ? "Edit Error" : "Add Error"}
            </DialogTitle>
            <DialogDescription>
              {editingError
                ? "Update the error details below."
                : "Add a new error entry to the tracker."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="error-data">Error Data</Label>
              <Textarea
                id="error-data"
                placeholder="Error message or description..."
                value={formData}
                onChange={(e) => setFormData(e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="error-counter">Occurrence Counter</Label>
              <Input
                id="error-counter"
                type="number"
                min={0}
                value={formCounter}
                onChange={(e) => setFormCounter(Number(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                !formData.trim() ||
                createMutation.isPending ||
                updateMutation.isPending
              }
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingError ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Advice Dialog */}
      <Dialog open={isAdviceOpen} onOpenChange={setIsAdviceOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BotMessageSquare className="h-5 w-5" />
              AI Error Analysis
            </DialogTitle>
            <DialogDescription>
              AI-powered analysis of all tracked errors
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {adviceMutation.isPending ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : adviceMutation.data ? (
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap rounded-lg bg-muted/50 p-4">
                {adviceMutation.data.advice}
              </div>
            ) : adviceMutation.isError ? (
              <div className="text-destructive text-sm">
                Failed to get AI analysis. Please try again.
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdviceOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
