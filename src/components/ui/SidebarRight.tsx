import { useEffect, useState } from "react";
import { DropdownButton, DropdownItem } from "react-bootstrap";
import { Encounter } from "../../modules/encounter-api/types";
import EncounterSidebar from "../encounterTracker/EncounterSidebar";

type RightBarProps = {
  isOpen: boolean;
  onSelectEncounter?: (encounterId: string) => void;
  onClose: () => void;
  encounterList: Encounter[];
  refreshEncounters: () => Promise<void>;
};

// all of this page is just one mega stub
export default function SidebarRight({
  isOpen,
  onSelectEncounter,
  encounterList,
  refreshEncounters,
}: RightBarProps) {
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const [selectedEncounter, setSelectedEncounter] = useState<string | null>(
    null
  );

  useEffect(() => {
    refreshEncounters();
  }, [refreshEncounters]);

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
          const selected = encounterList?.find((item) => item.id === id);
          if (selected) {
            setEncounter(selected);
            setSelectedEncounter(selected.id);
            onSelectEncounter?.(selected.id);
          }
        }}
      >
        {encounterList.length === 0 ? (
          <DropdownItem disabled>Could not Load Encounters</DropdownItem>
        ) : encounterList === null ? (
          <DropdownItem disabled>Loading encounters</DropdownItem>
        ) : encounterList.length === 0 ? (
          <DropdownItem disabled>No encounters</DropdownItem>
        ) : (
          encounterList.map(({ id, name }) => (
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
