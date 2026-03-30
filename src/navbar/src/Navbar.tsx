"use client";

import { Button as BaseButton } from "@anvilkit/ui/button";
import { cn } from "@anvilkit/ui/lib/utils";
import { Separator } from "@anvilkit/ui/separator";
import { ChevronRightIcon, MenuIcon, XIcon } from "lucide-react";
import { useId, useState, type MouseEventHandler, type ReactNode } from "react";

export interface NavbarLogoProps {
  type?: "text" | "image";
  text?: string;
  imageUrl?: string;
  alt?: string;
  href?: string;
}

export interface NavbarMenuItem {
  label: string;
  href: string;
}

export type NavbarActionVariant =
  | "default"
  | "destructive"
  | "ghost"
  | "link"
  | "outline"
  | "secondary";

export type NavbarActionSize = "default" | "lg" | "sm";

export interface NavbarAction {
  label: string;
  href?: string;
  variant?: NavbarActionVariant;
  size?: NavbarActionSize;
  openInNewTab?: boolean;
  disabled?: boolean;
}

export interface NavbarActionViewProps extends NavbarAction {
  onClick?: MouseEventHandler<HTMLElement>;
}

export interface NavbarProps {
  logo: NavbarLogoProps;
  items: NavbarMenuItem[];
  actions: NavbarAction[];
  active?: string;
}

export interface NavbarViewProps extends Omit<NavbarProps, "actions"> {
  actions?: NavbarActionViewProps[];
  logoNode?: ReactNode;
  className?: string;
  editMode?: boolean;
}

const logoTextClassName =
  "text-[1.05rem] font-semibold tracking-[-0.03em] text-foreground";

const desktopNavLinkClassName =
  "group relative inline-flex items-center py-1 text-[1.02rem] font-medium tracking-[-0.02em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none";

const mobileMenuPanelClassName = "space-y-2.5 pt-4 md:hidden";

const mobileMenuItemClassName =
  "flex min-h-12 items-center justify-between gap-4 rounded-xl px-4 py-3 text-left text-[1.05rem] font-medium tracking-[-0.02em] text-foreground transition-colors";

const mobileMenuItemHighlightedClassName = "bg-muted";

const mobileActionClassName =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-foreground px-6 py-2 text-[1.02rem] font-semibold tracking-[-0.02em] text-background shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const desktopActionBaseClassName =
  "inline-flex min-h-10 items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const desktopActionClasses = {
  default: "bg-foreground text-background shadow-sm hover:opacity-90",
  destructive: "bg-destructive text-background hover:opacity-90",
  ghost: "text-foreground hover:bg-accent",
  link: "text-foreground underline-offset-4 hover:underline",
  outline: "border border-input bg-background text-foreground hover:bg-accent",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
} satisfies Record<NavbarActionVariant, string>;

function composeHandlers(
  ...handlers: Array<MouseEventHandler<HTMLElement> | undefined>
) {
  if (handlers.every((handler) => !handler)) {
    return undefined;
  }

  return (
    event: Parameters<NonNullable<MouseEventHandler<HTMLElement>>>[0],
  ) => {
    for (const handler of handlers) {
      handler?.(event);
    }
  };
}

function getLogoContent(logo: NavbarLogoProps, logoNode?: ReactNode) {
  if (logoNode) {
    return logoNode;
  }

  if (logo.type === "image" && logo.imageUrl) {
    return (
      <img
        src={logo.imageUrl}
        alt={logo.alt || logo.text || "Logo"}
        className="h-8 w-auto max-w-40 object-contain"
      />
    );
  }

  return <span className={logoTextClassName}>{logo.text || "Brand"}</span>;
}

function getDesktopActionClassName(
  variant: NavbarActionVariant | undefined,
  disabled: boolean,
) {
  return cn(
    desktopActionBaseClassName,
    desktopActionClasses[variant || "outline"],
    disabled && "pointer-events-none opacity-50",
  );
}

function renderAction(
  action: NavbarActionViewProps,
  index: number,
  editMode: boolean,
  mobile: boolean,
  onClick?: MouseEventHandler<HTMLElement>,
) {
  const isDisabled = Boolean(action.disabled || editMode);
  const key = `${action.label}-${action.href || "button"}-${index}`;
  const composedOnClick = isDisabled
    ? undefined
    : composeHandlers(action.onClick, onClick);
  const actionClassName = mobile
    ? cn(mobileActionClassName, isDisabled && "pointer-events-none opacity-50")
    : getDesktopActionClassName(action.variant, isDisabled);

  if (action.href) {
    return (
      <a
        key={key}
        href={isDisabled ? undefined : action.href}
        target={!isDisabled && action.openInNewTab ? "_blank" : undefined}
        rel={
          !isDisabled && action.openInNewTab ? "noreferrer noopener" : undefined
        }
        aria-disabled={isDisabled || undefined}
        tabIndex={isDisabled ? -1 : undefined}
        onClick={composedOnClick}
        className={actionClassName}
      >
        {action.label}
      </a>
    );
  }

  return (
    <button
      key={key}
      type="button"
      disabled={isDisabled}
      onClick={composedOnClick}
      className={actionClassName}
    >
      {action.label}
    </button>
  );
}

function renderDesktopMenuItem(
  item: NavbarMenuItem,
  index: number,
  active: string | undefined,
  editMode: boolean,
) {
  const isActive = item.href === active;
  const key = `${item.label}-${item.href}-${index}`;

  return (
    <li key={key}>
      <a
        href={editMode ? undefined : item.href}
        aria-current={isActive ? "page" : undefined}
        aria-disabled={editMode || undefined}
        tabIndex={editMode ? -1 : undefined}
        className={cn(
          desktopNavLinkClassName,
          editMode && "pointer-events-none",
          isActive ? "text-foreground" : "text-muted-foreground",
        )}
      >
        <span>{item.label}</span>
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-x-0 -bottom-2 h-0.5 origin-left scale-x-0 bg-foreground transition-transform duration-200 group-hover:scale-x-100",
            isActive && "scale-x-100",
          )}
        />
      </a>
    </li>
  );
}

function renderMobileMenuItem(
  item: NavbarMenuItem,
  index: number,
  active: string | undefined,
  editMode: boolean,
  onClick?: MouseEventHandler<HTMLElement>,
) {
  const isActive = item.href === active;
  const key = `${item.label}-${item.href}-${index}`;

  return (
    <li key={key}>
      <a
        href={editMode ? undefined : item.href}
        aria-current={isActive ? "page" : undefined}
        aria-disabled={editMode || undefined}
        tabIndex={editMode ? -1 : undefined}
        onClick={editMode ? undefined : onClick}
        className={cn(
          mobileMenuItemClassName,
          editMode && "pointer-events-none",
          isActive && mobileMenuItemHighlightedClassName,
        )}
      >
        <span>{item.label}</span>
        <ChevronRightIcon
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground"
          strokeWidth={1.5}
        />
      </a>
    </li>
  );
}

function renderMobileToggleIcon(isOpen: boolean) {
  if (isOpen) {
    return (
      <XIcon aria-hidden="true" className="size-[1.125rem]" strokeWidth={2} />
    );
  }

  return (
    <MenuIcon aria-hidden="true" className="size-[1.125rem]" strokeWidth={2} />
  );
}

export function Navbar({
  logo,
  logoNode,
  items,
  actions = [],
  active,
  className,
  editMode = false,
}: NavbarViewProps) {
  const logoContent = getLogoContent(logo, logoNode);
  const isLogoInteractive = Boolean(logo.href && !editMode);
  const hasMobileMenu = items.length > 0 || actions.length > 0;
  const mobileMenuId = useId();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handleMobileMenuToggle() {
    setIsMobileMenuOpen((open) => !open);
  }

  function handleMobileMenuClose() {
    setIsMobileMenuOpen(false);
  }

  return (
    <nav
      aria-label="Primary"
      className={cn("w-full bg-background text-foreground", className)}
    >
      <div className="px-3 py-3 md:px-7 md:py-4 lg:px-8">
        <div className="flex items-center justify-between gap-4 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:gap-8">
          <div className="flex min-w-0 items-center md:justify-self-start">
            {isLogoInteractive ? (
              <a
                href={logo.href}
                className="inline-flex min-w-0 items-center gap-3 py-0.5 no-underline"
              >
                {logoContent}
              </a>
            ) : (
              <div className="inline-flex min-w-0 items-center gap-3 py-0.5">
                {logoContent}
              </div>
            )}
          </div>

          {hasMobileMenu ? (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-input bg-background md:hidden">
              <BaseButton
                type="button"
                variant="ghost"
                size="icon"
                aria-controls={mobileMenuId}
                aria-expanded={isMobileMenuOpen}
                onClick={handleMobileMenuToggle}
              >
                <span className="sr-only">
                  {isMobileMenuOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"}
                </span>
                {renderMobileToggleIcon(isMobileMenuOpen)}
              </BaseButton>
            </div>
          ) : null}

          {items.length > 0 ? (
            <div className="hidden min-w-0 justify-center md:flex">
              <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 sm:gap-x-10">
                {items.map((item, index) =>
                  renderDesktopMenuItem(item, index, active, editMode),
                )}
              </ul>
            </div>
          ) : (
            <div className="hidden md:block" />
          )}

          {actions.length > 0 ? (
            <div className="hidden flex-wrap items-center justify-start gap-4 md:flex md:justify-self-end md:justify-end">
              {actions.map((action, index) =>
                renderAction(action, index, editMode, false),
              )}
            </div>
          ) : (
            <div className="hidden md:block" />
          )}
        </div>

        {hasMobileMenu ? (
          <div className="pt-3 md:hidden">
            <Separator />
          </div>
        ) : null}

        {hasMobileMenu && isMobileMenuOpen ? (
          <div id={mobileMenuId} className={mobileMenuPanelClassName}>
            {items.length > 0 ? (
              <ul className="space-y-2.5">
                {items.map((item, index) =>
                  renderMobileMenuItem(
                    item,
                    index,
                    active,
                    editMode,
                    handleMobileMenuClose,
                  ),
                )}
              </ul>
            ) : null}

            {actions.length > 0 ? (
              <div className="flex flex-wrap justify-end gap-3 pt-2">
                {actions.map((action, index) =>
                  renderAction(
                    action,
                    index,
                    editMode,
                    true,
                    handleMobileMenuClose,
                  ),
                )}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </nav>
  );
}
