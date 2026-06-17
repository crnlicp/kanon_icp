import { useI18n } from "../i18n";
import type { SessionAvailabilityReturn } from "../backend/api/backend";

interface Props {
  availability: SessionAvailabilityReturn[];
  selectedIds: number[];
  personCount: number;
  onSelectionChange: (ids: number[]) => void;
  onPersonCountChange: (n: number) => void;
  unavailableIds?: number[];
  /**
   * When true, the +/− person counter is hidden and `personCount` is shown
   * as a read-only "spots needed" label. Used by per-member registration mode
   * where the spot count is derived from the member list.
   */
  disablePersonCounter?: boolean;
  /** Minimum allowed person count (default 1). */
  minPersonCount?: number;
  /** Maximum allowed person count (default 20). */
  maxPersonCount?: number;
}

export default function SessionSelector({
  availability,
  selectedIds,
  personCount,
  onSelectionChange,
  onPersonCountChange,
  unavailableIds = [],
  disablePersonCounter = false,
  minPersonCount = 1,
  maxPersonCount = 20,
}: Props) {
  const { t, localized } = useI18n();

  const sorted = [...availability].sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder));

  const toggle = (id: number, disabled: boolean) => {
    if (disabled) return;
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((s) => s !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {sorted.map((session) => {
          const id = Number(session.sessionId);
          const isSelected = selectedIds.includes(id);
          const isUnavailable = unavailableIds.includes(id);
          const isTotallyFull = session.totalFull;
          const isDisabled = isTotallyFull;

          const confirmed = Number(session.confirmedCount);
          const cap = Number(session.capacity);
          const bufferCap = Number(session.bufferCapacity);
          const bufferUsed = Number(session.bufferCount);
          const bufferLeft = bufferCap - bufferUsed;

          let badgeText = "";
          let badgeClass = "";

          if (isTotallyFull) {
            badgeText = t("fullyBooked");
            badgeClass = "bg-red-500/15 text-red-400 border-red-500/20";
          } else if (session.regularFull) {
            badgeText = `${t("regularFull")} · ${bufferLeft} ${t("bufferSpotsRemaining")}`;
            badgeClass = "bg-yellow-500/15 text-yellow-400 border-yellow-500/20";
          } else {
            const left = cap - confirmed;
            badgeText = `${left} / ${cap} ${t("spotsRemaining")}`;
            badgeClass = "bg-primary/10 text-primary/80 border-primary/20";
          }

          return (
            <label
              key={id}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                isDisabled
                  ? "opacity-50 cursor-not-allowed border-white/5 bg-white/[0.02]"
                  : isSelected
                  ? "border-primary/40 bg-primary/5"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              } ${isUnavailable ? "border-red-500/40" : ""}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggle(id, isDisabled)}
                disabled={isDisabled}
                className="mt-0.5 w-4 h-4 accent-primary shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-sm font-medium ${isDisabled ? "text-white/40" : "text-white"}`}>
                    {localized(session.name_fa, session.name_sv)}
                  </span>
                  {session.date && (
                    <span className="text-xs text-white/40">{session.date}</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${badgeClass}`}>
                    {badgeText}
                  </span>
                </div>
                {isUnavailable && (
                  <p className="text-xs text-red-400 mt-1">{t("nowFullDeselect")}</p>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {/* Person count */}
      {disablePersonCounter ? (
        <div className="flex items-center gap-3">
          <label className="text-sm text-white/70 shrink-0">{t("spotsNeeded")}</label>
          <span className="text-white font-semibold">{personCount}</span>
          <span className="text-sm text-white/40">{t("person")}</span>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <label className="text-sm text-white/70 shrink-0">{t("howManyPeople")}</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPersonCountChange(Math.max(minPersonCount, personCount - 1))}
              className="w-8 h-8 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 flex items-center justify-center text-lg transition-colors"
            >
              −
            </button>
            <span className="w-10 text-center text-white font-semibold">{personCount}</span>
            <button
              type="button"
              onClick={() => onPersonCountChange(Math.min(maxPersonCount, personCount + 1))}
              className="w-8 h-8 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 flex items-center justify-center text-lg transition-colors"
            >
              +
            </button>
            <span className="text-sm text-white/40">{t("person")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
