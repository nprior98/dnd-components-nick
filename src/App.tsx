import MainLayout from "./components/MainLayout";
import "./styles/Style.css";
import Router from "./routes";
import background from "/desk_bg.png";
import { useState } from "react";
import { listEncounters } from "./modules/encounter-api";
import { Encounter } from "./modules/encounter-api";

export default function App() {
  const [encounters, setEncounters] = useState<Encounter[]>([]);

  async function refreshEncounters() {
    const result = await listEncounters();
    setEncounters(result.data ?? []);
  }
  return (
    <MainLayout
      encounterList={encounters}
      refreshEncounters={refreshEncounters}
    >
      <div
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Router
          refreshEncounters={refreshEncounters}
          encounterList={encounters}
        />
      </div>
    </MainLayout>
  );
}
