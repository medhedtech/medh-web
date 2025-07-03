"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { buildComponent } from "@/utils/designSystem";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Trash
} from "lucide-react";

export interface Column<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  filterable?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  actions?: {
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick: (row: T) => void;
    variant?: "default" | "destructive" | "outline" | "secondary";
  }[];
  bulkActions?: {
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick: (selectedRows: T[]) => void;
    variant?: "default" | "destructive" | "outline" | "secondary";
  }[];
  onRowClick?: (row: T) => void;
  emptyState?: {
    title: string;
    description: string;
    icon?: React.ComponentType<{ className?: string }>;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
}

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchable = true,
  searchPlaceholder = "Search...",
  filterable = false,
  selectable = false,
  pagination = true,
  pageSize = 10,
  actions,
  bulkActions,
  onRowClick,
  emptyState
}: DataTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Filtering and searching
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply column filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(row =>
          String(row[key]).toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    return filtered;
  }, [data, searchTerm, filters]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return current.direction === "asc"
          ? { key, direction: "desc" }
          : null;
      }
      return { key, direction: "asc" };
    });
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? [...paginatedData] : []);
  };

  const handleSelectRow = (row: T, checked: boolean) => {
    setSelectedRows(current =>
      checked
        ? [...current, row]
        : current.filter(r => r !== row)
    );
  };

  const isRowSelected = (row: T) => {
    return selectedRows.some(r => r === row);
  };

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key) return <ArrowUpDown className="h-4 w-4" />;
    return sortConfig.direction === "asc" 
      ? <ArrowUp className="h-4 w-4" /> 
      : <ArrowDown className="h-4 w-4" />;
  };

  const renderCellContent = (column: Column<T>, row: T) => {
    const value = row[column.key];
    
    if (column.render) {
      return column.render(value, row);
    }

    // Default renderers for common data types
    if (typeof value === "boolean") {
      return <Badge variant={value ? "success" : "secondary"}>{value ? "Yes" : "No"}</Badge>;
    }
    
    if (column.key.includes("email")) {
      return <span className="text-blue-600 dark:text-blue-400">{value}</span>;
    }
    
    if (column.key.includes("status")) {
      return <Badge variant="outline">{value}</Badge>;
    }
    
    if (column.key.includes("avatar") || column.key.includes("image")) {
      return (
        <Avatar className="h-8 w-8">
          <AvatarImage src={value} />
          <AvatarFallback>{row.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
      );
    }

    return String(value);
  };

  if (loading) {
    return (
      <Card className={buildComponent.card('elegant')}>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0 && !loading) {
    return (
      <Card className={buildComponent.card('elegant')}>
        <CardContent className="p-12 text-center">
          {emptyState?.icon && <emptyState.icon className="mx-auto h-12 w-12 text-slate-400 mb-4" />}
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {emptyState?.title || "No data found"}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {emptyState?.description || "There are no items to display."}
          </p>
          {emptyState?.action && (
            <Button onClick={emptyState.action.onClick}>
              {emptyState.action.label}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={buildComponent.card('elegant')}>
        {/* Table Header with Search and Filters */}
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-1 gap-4">
              {searchable && (
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              )}
              
              {filterable && (
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              )}
            </div>

            {/* Bulk Actions */}
            {selectable && selectedRows.length > 0 && bulkActions && (
              <div className="flex gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center">
                  {selectedRows.length} selected
                </span>
                {bulkActions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || "outline"}
                    size="sm"
                    onClick={() => action.onClick(selectedRows)}
                  >
                    {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                    {action.label}
                  </Button>
                ))}
              </div>
            )}

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {selectable && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                  )}
                  {columns.map((column) => (
                    <TableHead
                      key={column.key}
                      className={`${column.width || ""} ${
                        column.align === "center" ? "text-center" : 
                        column.align === "right" ? "text-right" : ""
                      }`}
                    >
                      {column.sortable ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort(column.key)}
                          className="h-auto p-0 hover:bg-transparent"
                        >
                          {column.label}
                          {getSortIcon(column.key)}
                        </Button>
                      ) : (
                        column.label
                      )}
                    </TableHead>
                  ))}
                  {actions && actions.length > 0 && (
                    <TableHead className="w-24 text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((row, index) => (
                  <TableRow
                    key={index}
                    className={`${
                      onRowClick ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50" : ""
                    } ${isRowSelected(row) ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <TableCell>
                        <Checkbox
                          checked={isRowSelected(row)}
                          onCheckedChange={(checked) => handleSelectRow(row, checked as boolean)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell
                        key={column.key}
                        className={`${
                          column.align === "center" ? "text-center" : 
                          column.align === "right" ? "text-right" : ""
                        }`}
                      >
                        {renderCellContent(column, row)}
                      </TableCell>
                    ))}
                    {actions && actions.length > 0 && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          {actions.map((action, actionIndex) => (
                            <Button
                              key={actionIndex}
                              variant={action.variant || "ghost"}
                              size="sm"
                              onClick={() => action.onClick(row)}
                            >
                              {action.icon && <action.icon className="h-4 w-4" />}
                              {!action.icon && action.label}
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination && totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <span className="text-sm text-slate-600 dark:text-slate-400 px-2">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DataTable; 