// Shared three-step card color system used by the partnership and team
// sections: ink (accent) → mid stone → pale wash. Each step keeps text,
// chip (icon square / avatar circle), label, and body colors in sync, and
// every step resolves correctly in both light and dark themes.

export interface CardTone {
  // Container background + base text color
  card: string;
  // Icon square / avatar circle
  chip: string;
  // Mono microtype line (tag / role)
  label: string;
  // Body copy
  body: string;
}

export const CARD_TONES: CardTone[] = [
  {
    card: "bg-accent text-accent-foreground",
    chip: "bg-accent-foreground/10 text-accent-foreground",
    label: "text-accent-foreground/55",
    body: "text-accent-foreground/75",
  },
  {
    // Mid step between ink and pale wash; neutral-800 is the equivalent
    // step measured from the dark end for dark mode
    card: "bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-foreground",
    chip: "bg-foreground/10 text-foreground",
    label: "text-foreground/45",
    body: "text-foreground/60",
  },
  {
    // Solid equivalents of the old bg-foreground/[0.04] wash — cards must be
    // opaque now that decorative layers (globe) can sit behind them
    card: "bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-foreground",
    chip: "bg-foreground/10 text-foreground",
    label: "text-foreground/45",
    body: "text-foreground/60",
  },
];
