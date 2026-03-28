interface Props {
  tag: string;
  onRemove?: () => void;
}

export function TagChip({ tag, onRemove }: Props) {
  return (
    <span className="inline-flex items-center gap-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs px-2 py-0.5 rounded-full">
      #{tag}
      {onRemove && (
        <button
          onClick={onRemove}
          className="text-indigo-400 hover:text-indigo-200 leading-none"
          aria-label={`Remove tag ${tag}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
