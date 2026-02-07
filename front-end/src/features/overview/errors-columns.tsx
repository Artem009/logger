import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, BotMessageSquare, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import type { ErrorEntry } from "@/types/error";

interface ErrorActionsProps {
  onEdit?: (error: ErrorEntry) => void;
  onDelete?: (error: ErrorEntry) => void;
  onAdvice?: () => void;
}

export const createErrorColumns = ({
  onEdit,
  onDelete,
  onAdvice,
}: ErrorActionsProps = {}): ColumnDef<ErrorEntry>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return (
        <div
          className="font-mono text-xs cursor-pointer max-w-[100px] truncate"
          title={id}
          onClick={() => navigator.clipboard.writeText(id)}
        >
          {id.slice(0, 8)}...
        </div>
      );
    },
  },
  {
    accessorKey: "data",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Error" />
    ),
    cell: ({ row }) => {
      const data = row.getValue("data") as string;
      const displayData = typeof data === "string" ? data : JSON.stringify(data);
      return (
        <div className="max-w-[400px] truncate font-medium" title={displayData}>
          {displayData}
        </div>
      );
    },
  },
  {
    accessorKey: "counter",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Count" />
    ),
    cell: ({ row }) => {
      const counter = row.getValue("counter") as number;
      return (
        <div className="text-center">
          <Badge variant={counter > 10 ? "destructive" : counter > 3 ? "secondary" : "outline"}>
            {counter}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const error = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(error.id)}
            >
              Copy error ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit?.(error)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete?.(error)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
