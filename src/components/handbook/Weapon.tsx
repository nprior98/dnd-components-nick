import { Container, Row, Col } from "react-bootstrap";
import weaponJson from "../../../data/weapons/srd-2024_dagger.json"
import "../../../themes/V3/phb.standalone.css";
import { useEffect, useState } from "react";

const weapon = weaponJson;

//True if the range is 0 or if it can be thrown
const isMelee = weapon.range === 0 || weapon.properties.some(
  properties => properties.property.name === "Thrown");

// working on a constant with arrow functions that holds the mastery property so that it can be displayed later
// const masteryProperty = weapon.properties.some(
//   properties => properties.property.type === "Mastery")


export default function Weapon() {


  return (
    <div className="phb page" id="p3" data-index="2">
      <h1>Weapon</h1>
      <div>
        <h2>{weapon.name}</h2>
        <div>
          <div>
            <strong>Type: </strong>{weapon.is_simple ? "Simple" : "Martial"} {isMelee ? "Melee" : "Ranged"} Weapon <br />
          </div>
          <br />
          <div>
            Proficiency with a {weapon.name} allows you to add your proficiency bonus to the attack roll for any attack you make with it.
            {/* <hr /> */}
            <br />
            This weapon has the following mastery property. To use this property, you must have a feature that lets you use it.
            <br />
            {/* mastery property stuff goes here */}
            <br />
            {/* will find a way to neatly display the grid later */}
            <Container>
              <Row>
                <Col xs={3}><strong>Name</strong></Col>
                <Col xs={4}><strong>Damage</strong></Col>
                <Col xs={5}><strong>Properties</strong></Col>
              </Row>
              <Row>
                <Col xs={3}>{weapon.name}</Col>
                <Col xs={4}>{weapon.damage_dice} {weapon.damage_type.name}</Col>
                <Col xs={5}>{/* will figure out how to list all properties later*/}</Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
}
