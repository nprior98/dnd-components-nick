import { Routes, Route } from "react-router";
import {
  Creature,
  Weapon,
  Armor,
  Class,
  Backgrounds,
  Documents,
  Feats,
  MagicItem,
  Species,
  Spell,
} from "./components/handbook";
import EncounterTracker from "./components/encounterTracker/EncounterTracker";
import EncounterGenDemo from "./components/encounterGen/EncounterGenDemo";
import CharacterPage from "./components/playerCharacters/CharacterPage";

export default function Router() {
  return (
    <Routes>
      <Route index element={<h1>Insert Landing Page here</h1>} />
      <Route path="encounter">
        <Route path="armor/:stub" element={<Armor />} />
        <Route path="backgrounds/:stub" element={<Backgrounds />} />
        <Route path="creatures/:stub" element={<Creature />} />
        <Route path="classes/:stub" element={<Class />} />
        <Route path="conditions/:stub" element={<Class />} />
        <Route path="documents/:stub" element={<Documents />} />
        <Route path="feats/:stub" element={<Feats />} />
        <Route path="magicItems/:stub" element={<MagicItem />} />
        <Route path="species/:stub" element={<Species />} />
        <Route path="spells/:stub" element={<Spell />} />
        <Route path="weapons/:stub" element={<Weapon />} />
        <Route path="subclasses/:stub" element={<Class />} />
        <Route path="track" element={<EncounterTracker />} />
        <Route path="generate" element={<EncounterGenDemo />} />
        <Route path="characters" element={<CharacterPage />} />
      </Route>
    </Routes>
  );
}
