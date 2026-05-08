import { useEffect, useState } from "react";
import { DropdownButton, DropdownItem } from "react-bootstrap";
import { listEncounters } from "../../modules/encounter-api";
import { Encounter } from "../../modules/encounter-api/types";
import EncounterSidebar from "../encounterTracker/EncounterSidebar";

type RightBarProps = {
  isOpen: boolean;
  onSelectEncounter?: (encounterId: string) => void;
  onClose: () => void;
};

// all of this page is just one mega stub
export default function SidebarRight({
  isOpen,
  onSelectEncounter,
}: RightBarProps) {
  const [encounters, setEncounters] = useState<Encounter[] | null>(null);
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedEncounter, setSelectedEncounter] = useState<string | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const result = await listEncounters();
      if (cancelled) return;

      if (result.status === 200) {
        setEncounters(result.data ?? []);
        setLoadError(null);
      } else {
        setEncounters([]);
        setLoadError("Could not load encounters");
      }
    }

    load().catch(() => {
      if (!cancelled) {
        setEncounters([]);
        setLoadError("Could not load encounters");
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <aside
      id="sidebar-right"
      className={`sidebar sidebar-right${isOpen ? " open" : ""}`}
      aria-hidden={!isOpen}
    >
      <DropdownButton
        id="sidebar-dropdown-selection"
        title={encounter?.name ?? "Select encounter"}
        onSelect={(id) => {
          const selected = encounters?.find((item) => item.id === id);
          if (selected) {
            setEncounter(selected);
            setSelectedEncounter(selected.id);
            onSelectEncounter?.(selected.id);
          }
        }}
      >
        {loadError ? (
          <DropdownItem disabled>{loadError}</DropdownItem>
        ) : encounters === null ? (
          <DropdownItem disabled>Loading encounters</DropdownItem>
        ) : encounters.length === 0 ? (
          <DropdownItem disabled>No encounters</DropdownItem>
        ) : (
          encounters.map(({ id, name }) => (
            <DropdownItem className="encounter" key={id} eventKey={id}>
              {name}
            </DropdownItem>
          ))
        )}
      </DropdownButton>
      {selectedEncounter && (
        <EncounterSidebar encounterId={selectedEncounter} />
      )}
    </aside>
  );
}
