import { useState } from "react";
import { NormalizedCreature } from "../../modules/encounter-gen";
import { Character } from "../playerCharacters/CharacterPage";

type RightBarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const characterParty: Character[] = [];
const creatureParty: NormalizedCreature[] = [];

// all of this page is just one mega stub 

export default function RightBar({ isOpen, onClose }: RightBarProps) {

  return (
    <aside
      id="sidebar-right"
      className={`sidebar sidebar-right${isOpen ? " open" : ""}`}
    >
      
    </aside>
  )
    

}