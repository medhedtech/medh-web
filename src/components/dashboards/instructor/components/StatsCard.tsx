"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buildComponent, buildAdvancedComponent } from "@/utils/designSystem";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease" | "neutral";
    period?: string;
  };
  icon?: LucideIcon;
  iconColor?: string;
  description?: string;
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
  };
  onClick?: () => void;
  loading?: boolean;
  variant?: "default" | "glass" | "gradient";
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-blue-500",
  description,
  badge,
  onClick,
  loading = false,
  variant = "default"
}) => {
  const getTrendIcon = () => {
    if (!change) return null;
    
    switch (change.type) {
      case "increase":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "decrease":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-slate-500" />;
    }
  };

  const getTrendColor = () => {
    if (!change) return "";
    
    switch (change.type) {
      case "increase":
        return "text-green-600 dark:text-green-400";
      case "decrease":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-slate-600 dark:text-slate-400";
    }
  };

  const getCardClass = () => {
    switch (variant) {
      case "glass":
        return buildAdvancedComponent.glassCard({ variant: 'primary', hover: true });
      case "gradient":
        return "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-200";
      default:
        return buildComponent.card('elegant', 'desktop') + " hover:shadow-lg transition-all duration-200";
    }
  };

  if (loading) {
    return (
      <Card className={getCardClass()}>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
              <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card 
        className={`${getCardClass()} ${onClick ? "cursor-pointer" : ""}`}
        onClick={onClick}
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {title}
              </h3>
              {badge && (
                <Badge variant={badge.variant || "default"} className="text-xs">
                  {badge.label}
                </Badge>
              )}
            </div>
            {Icon && (
              <div className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-800 ${iconColor}`}>
                <Icon className="h-5 w-5" />
              </div>
            )}
          </div>

          {/* Value */}
          <div className="mb-2">
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          </div>

          {/* Change and Description */}
          <div className="flex items-center justify-between">
            <div>
              {change && (
                <div className="flex items-center gap-1">
                  {getTrendIcon()}
                  <span className={`text-sm font-medium ${getTrendColor()}`}>
                    {change.value > 0 ? '+' : ''}{change.value}%
                  </span>
                  {change.period && (
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {change.period}
                    </span>
                  )}
                </div>
              )}
              {description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard; 