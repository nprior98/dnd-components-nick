import { Container, Row, Col } from "react-bootstrap";
import weaponJson from "../../../data/weapons/srd-2024_sickle.json"
import "../../../themes/V3/phb.standalone.css";
import { useEffect, useState } from "react";

const weapon = weaponJson;

//True if the range is 0 or if it can be thrown
const isMelee = weapon.range === 0 || weapon.properties.some(
  weapon => weapon.property.name === "Thrown");


export default function Weapon() {


  return (
    <div className="phb page" id="p3" data-index="2">
      <h1>Weapon</h1>
      <div>
        <h2>{weapon.name}</h2>
        <Container className="block frame wide">
          <div>
            Type: {weapon.is_simple ? "Simple" : "Martial"} {isMelee ? "Melee" : "Ranged"} Weapon
          </div>
          <hr/>


        </Container>
      </div>
    </div>
  );
}
