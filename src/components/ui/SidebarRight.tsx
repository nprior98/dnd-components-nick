import { useEffect, useState } from "react";
import { DropdownButton, DropdownItem } from "react-bootstrap";
import { getApiEncounters } from "../../modules/encounter-api/sdk.gen";
import { Encounter } from "../../modules/encounter-api/types.gen";

type RightBarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function RightSideBar({ isOpen, onClose }: RightBarProps) {
  const [encounters, setEncounters] = useState<Encounter[] | null>(null);
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const result = await getApiEncounters();
      if (cancelled) return;

      if (result.response.status === 200) {
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
          if (selected) setEncounter(selected);
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
            <DropdownItem key={id} eventKey={id}>
              {name}
            </DropdownItem>
          ))
        )}
      </DropdownButton>
    </aside>
  );
}
