import { useEncounterSocket } from "./useEncounterSocket";
import type  { Encounter }  from "../../modules/encounter-api/types.gen"
import { getApiEncounters } from "../../modules/encounter-api/sdk.gen"
import "../../styles/Tracker.css";
import { useState } from "react";

// Main function
export default function EncounterSidebar() {
  const [encounters, setEncounters] = useState<Encounter | null>(null)

  useEncounterSocket{}
}
