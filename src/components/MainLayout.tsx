import { Container } from "react-bootstrap";
import { ReactNode, useState } from "react";
import Sidebar from "./ui/Sidebar";
import Topbar from "./ui/Topbar";
import RightBar from "./ui/RightBar";

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
      <Sidebar
        isOpen={libraryOpen}
        onClose={() => setLibraryOpen(false)}
      />
      <RightBar
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
