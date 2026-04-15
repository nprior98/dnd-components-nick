import { Routes, Route } from "react-router";
import { Creature, Weapon, Armor, Class } from "./components/handbook";
import EncounterTracker from "./components/encounterTracker/EncounterTracker";

export default function Router() {
  return (
    <Routes>
      <Route index element={<h1>Insert Landing Page here</h1>} />
      <Route path="encounter">
        <Route path="creatures/:stub" element={<Creature />} />
        <Route path="weapons/:stub" element={<Weapon />} />
        <Route path="armor/:stub" element={<Armor />} />
        <Route path="classes/:stub" element={<Class />} />
        <Route path="subclasses/:stub" element={<Class />} />
        <Route path="track" element={<EncounterTracker />} />
      </Route>
    </Routes>
  );
}
