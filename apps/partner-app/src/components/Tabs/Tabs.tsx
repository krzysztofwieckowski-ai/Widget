import { useRef, type KeyboardEvent, type ReactNode } from 'react';

export type TabItem<Id extends string> = {
  id: Id;
  label: string;
  /** Optional small count next to the label, e.g. the number of consultants. */
  count?: number;
  content: ReactNode;
};

type TabsProps<Id extends string> = {
  /** Accessible name of the tab list. */
  label: string;
  idPrefix: string;
  tabs: TabItem<Id>[];
  selected: Id;
  onSelect: (id: Id) => void;
};

/**
 * Accessible tabs (WAI-ARIA tabs pattern, automatic activation): arrow keys, Home and End move between
 * tabs, only the selected tab is in the tab order. All panels stay mounted (just hidden), so a half-filled
 * form is not lost when the admin looks at another section.
 */
export default function Tabs<Id extends string>({ label, idPrefix, tabs, selected, onSelect }: TabsProps<Id>) {
  const listRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = tabs.findIndex((tab) => tab.id === selected);
    // Arrow keys follow the reading direction (reversed in Arabic).
    const isRtl = listRef.current ? getComputedStyle(listRef.current).direction === 'rtl' : false;
    const forwardKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
    const backKey = isRtl ? 'ArrowRight' : 'ArrowLeft';

    let next = -1;
    if (event.key === forwardKey) next = (index + 1) % tabs.length;
    else if (event.key === backKey) next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    if (next === -1) return;

    event.preventDefault();
    onSelect(tabs[next].id);
    document.getElementById(`${idPrefix}-tab-${tabs[next].id}`)?.focus();
  }

  return (
    <div className="tabs">
      <div ref={listRef} className="tabs-list" role="tablist" aria-label={label} onKeyDown={handleKeyDown}>
        {tabs.map((tab) => {
          const isSelected = tab.id === selected;
          return (
            <button
              key={tab.id}
              id={`${idPrefix}-tab-${tab.id}`}
              type="button"
              role="tab"
              className="tab"
              aria-selected={isSelected}
              aria-controls={`${idPrefix}-panel-${tab.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onSelect(tab.id)}
            >
              {tab.label}
              {tab.count !== undefined && <span className="tab-count">{tab.count}</span>}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`${idPrefix}-panel-${tab.id}`}
          role="tabpanel"
          className="tab-panel"
          aria-labelledby={`${idPrefix}-tab-${tab.id}`}
          hidden={tab.id !== selected}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
