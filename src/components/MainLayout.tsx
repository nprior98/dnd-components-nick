import { Container } from "react-bootstrap";
import { ReactNode, useState } from "react";
import Topbar from "./ui/Topbar";
import LeftSidebar from "./ui/SidebarLeft";
import RightSideBar from "./ui/SidebarRight";

export default function MainLayout({ children }: { children: ReactNode }) {
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
      <LeftSidebar
        isOpen={libraryOpen}
        onClose={() => setLibraryOpen(false)}
      />
      <RightSideBar
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
