/**
 * Reusable Page Component Templates
 *
 * These components ensure consistent design across all generated pages
 * and match the landing page aesthetic.
 */

import React from 'react';
import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { THEME, TAILWIND_CLASSES } from '@/lib/constants/theme';

// ============================================================================
// PAGE STRUCTURE COMPONENTS
// ============================================================================

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: string[];
}

export function PageHeader({ title, description, breadcrumb }: PageHeaderProps) {
  return (
    <header className={TAILWIND_CLASSES.pageHeader}>
      <div className={TAILWIND_CLASSES.container}>
        {breadcrumb && breadcrumb.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
            {breadcrumb.map((item, idx) => (
              <React.Fragment key={idx}>
                <span>{item}</span>
                {idx < breadcrumb.length - 1 && (
                  <span className="text-white/50">/</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-bold mb-3">{title}</h1>
        {description && (
          <p className="text-lg md:text-xl text-white/90 max-w-3xl">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function Section({ children, className = '', fullWidth = false }: SectionProps) {
  return (
    <section className={`${TAILWIND_CLASSES.section} ${className}`}>
      <div className={fullWidth ? 'w-full px-6' : TAILWIND_CLASSES.container}>
        {children}
      </div>
    </section>
  );
}

// ============================================================================
// KPI / METRICS COMPONENTS
// ============================================================================

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  icon?: React.ReactNode;
}

export function KPICard({ title, value, change, trend, subtitle, icon }: KPICardProps) {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className={TAILWIND_CLASSES.kpiCard}>
      <div className="flex items-start justify-between mb-3">
        <p className={TAILWIND_CLASSES.kpiLabel}>{title}</p>
        {icon && <div className="text-[#00C8FF]">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-3 mb-2">
        <p className={TAILWIND_CLASSES.kpiValue}>{value}</p>
        {change !== undefined && (
          <span className={`flex items-center gap-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-sm font-medium">{Math.abs(change)}%</span>
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-sm text-gray-600">{subtitle}</p>
      )}
    </div>
  );
}

interface MetricsGridProps {
  metrics: Array<{
    title: string;
    value: string | number;
    change?: number;
    trend?: 'up' | 'down' | 'neutral';
    subtitle?: string;
  }>;
  columns?: 2 | 3 | 4;
}

export function MetricsGrid({ metrics, columns = 3 }: MetricsGridProps) {
  const gridClass = columns === 2 ? TAILWIND_CLASSES.grid2
                  : columns === 4 ? TAILWIND_CLASSES.grid4
                  : TAILWIND_CLASSES.grid3;

  return (
    <div className={gridClass}>
      {metrics.map((metric, idx) => (
        <KPICard key={idx} {...metric} />
      ))}
    </div>
  );
}

// ============================================================================
// CARD COMPONENTS
// ============================================================================

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export function Card({ title, children, className = '', headerAction }: CardProps) {
  return (
    <div className={`${TAILWIND_CLASSES.card} ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className={TAILWIND_CLASSES.cardHeader}>{title}</h3>
          {headerAction}
        </div>
      )}
      {children}
    </div>
  );
}

// ============================================================================
// BUTTON COMPONENTS
// ============================================================================

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  className?: string;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  disabled = false,
  className = ''
}: ButtonProps) {
  const baseClass = variant === 'primary' ? TAILWIND_CLASSES.buttonPrimary
                  : variant === 'secondary' ? TAILWIND_CLASSES.buttonSecondary
                  : TAILWIND_CLASSES.buttonOutline;

  const sizeClass = size === 'sm' ? 'px-4 py-2 text-sm'
                  : size === 'lg' ? 'px-8 py-4 text-lg'
                  : 'px-6 py-3';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${sizeClass} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} flex items-center gap-2`}
    >
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </button>
  );
}

// ============================================================================
// INTERACTIVE COMPONENTS
// ============================================================================

interface ActionCardProps {
  title: string;
  description: string;
  onClick: () => void;
  icon?: React.ReactNode;
  badge?: string;
}

export function ActionCard({ title, description, onClick, icon, badge }: ActionCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-[#00C8FF] hover:shadow-lg transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        {icon && (
          <div className="w-12 h-12 rounded-lg bg-[#00C8FF]/10 flex items-center justify-center text-[#00C8FF] group-hover:bg-[#00C8FF] group-hover:text-white transition-colors">
            {icon}
          </div>
        )}
        {badge && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700">
            {badge}
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-[#0A1930] mb-2 group-hover:text-[#00C8FF] transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      <div className="flex items-center text-[#00C8FF] text-sm font-medium group-hover:gap-2 transition-all">
        <span>Explore</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}

// ============================================================================
// DATA DISPLAY COMPONENTS
// ============================================================================

interface DataPoint {
  label: string;
  value: string | number;
}

interface DataListProps {
  data: DataPoint[];
  columns?: 2 | 3;
}

export function DataList({ data, columns = 2 }: DataListProps) {
  const gridClass = columns === 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div className={`grid ${gridClass} gap-4`}>
      {data.map((item, idx) => (
        <div key={idx} className="border-l-4 border-[#00C8FF] pl-4">
          <p className="text-sm text-gray-600 mb-1">{item.label}</p>
          <p className="text-lg font-semibold text-[#0A1930]">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// LAYOUT HELPERS
// ============================================================================

interface TwoColumnLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  leftWidth?: '1/3' | '1/2' | '2/3';
}

export function TwoColumnLayout({ left, right, leftWidth = '1/2' }: TwoColumnLayoutProps) {
  const widthClass = leftWidth === '1/3' ? 'md:grid-cols-[1fr,2fr]'
                   : leftWidth === '2/3' ? 'md:grid-cols-[2fr,1fr]'
                   : 'md:grid-cols-2';

  return (
    <div className={`grid grid-cols-1 ${widthClass} gap-8`}>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}

// ============================================================================
// EMPTY STATE
// ============================================================================

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[#0A1930] mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="primary">
          {action.label}
        </Button>
      )}
    </div>
  );
}

// ============================================================================
// BADGE COMPONENT
// ============================================================================

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  const variantClass = variant === 'success' ? 'bg-green-100 text-green-700'
                     : variant === 'warning' ? 'bg-yellow-100 text-yellow-700'
                     : variant === 'error' ? 'bg-red-100 text-red-700'
                     : variant === 'info' ? 'bg-blue-100 text-blue-700'
                     : 'bg-gray-100 text-gray-700';

  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variantClass} ${sizeClass}`}>
      {children}
    </span>
  );
}
