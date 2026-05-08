import { Container } from "react-bootstrap";
import { ReactNode, useState } from "react";
import Topbar from "./ui/Topbar";
import LeftSidebar from "./ui/SidebarLeft";
import SidebarRight from "./ui/SidebarRight";
import { Encounter } from "../modules/encounter-api";

type MainLayoutProps = {
  children: ReactNode;
  encounterList: Encounter[];
  refreshEncounters: () => Promise<void>;
};

export default function MainLayout({
  children,
  encounterList,
  refreshEncounters,
}: MainLayoutProps) {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [catalogueOpen, setCatalogueOpen] = useState(false);

  return (
    <>
      <Topbar
        libraryOpen={libraryOpen}
        catalogueOpen={catalogueOpen}
        onToggleLibrary={() => setLibraryOpen((o) => !o)}
        onToggleCatalogue={() => setCatalogueOpen((o) => !o)}
      />
      <LeftSidebar isOpen={libraryOpen} onClose={() => setLibraryOpen(false)} />
      <SidebarRight
        refreshEncounters={refreshEncounters}
        encounterList={encounterList}
        isOpen={catalogueOpen}
        onClose={() => setCatalogueOpen(false)}
      />
      <Container
        fluid
        className={`main-content${libraryOpen ? " library-open" : ""}`}
      >
        {children}
      </Container>
    </>
  );
}
