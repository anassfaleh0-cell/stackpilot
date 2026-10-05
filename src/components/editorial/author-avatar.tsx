const AVATAR_SIZES = {
  sm: { box: "h-10 w-10 text-xs", pixels: 40 },
  md: { box: "h-12 w-12 text-sm", pixels: 48 },
  lg: { box: "h-20 w-20 text-2xl", pixels: 80 },
} as const

export type AuthorAvatarSize = keyof typeof AVATAR_SIZES

export function authorInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
}

type AuthorAvatarProps = {
  name: string
  src?: string | null
  alt?: string
  size?: AuthorAvatarSize
  className?: string
}

export function AuthorAvatar({ name, src, alt, size = "md", className }: AuthorAvatarProps) {
  const { box, pixels } = AVATAR_SIZES[size]
  const classes = [
    "flex shrink-0 items-center justify-center rounded-full border border-border bg-muted-bg font-bold text-primary",
    box,
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ")

  if (src) {
    return (
      <div className={classes}>
        <img
          src={src}
          alt={alt ?? name}
          width={pixels}
          height={pixels}
          loading="lazy"
          decoding="async"
          className="h-full w-full rounded-full object-cover"
        />
      </div>
    )
  }

  return (
    <div className={classes} aria-hidden="true">
      {authorInitials(name)}
    </div>
  )
}
