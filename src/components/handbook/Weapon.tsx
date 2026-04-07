import weaponJson from "../../../data/weapons/srd-2024_shortbow.json"
import "../../../themes/V3/phb.standalone.css";

const weapon = weaponJson;

//True if the range is 0 or if it can be thrown
const isMelee = weapon.range === 0 || weapon.properties.some(
  properties => properties.property.name === "Thrown");

//Stores the mastery property separately
const masteryProperty = weapon.properties.find(
  properties => properties.property.type === "Mastery");

//Stores all the property names and adds appropriate details 
const propertyNames = weapon.properties.map((properties) => {
  if (properties.property.name === "Thrown" || properties.property.name === "Versatile") {
    return `${properties.property.name} (${properties.detail})`;
  } else {
    return `${properties.property.name}, `;
  }});

//If the weapon is ranged, it adds the weapon range to the propertyNames array
if (!isMelee) propertyNames.push(`, (Range ${weapon.range}/${weapon.long_range})`);


export default function Weapon() {
  return (
    <div className="phb page wide" id="p3" data-index="2">
      <h1>Weapon</h1>
      <div>
        <h2>{weapon.name}</h2>
        <div>
          <div>
            <strong>Type: </strong>{weapon.is_simple ? "Simple" : "Martial"} {isMelee ? "Melee" : "Ranged"} Weapon <br /><br />
            <p>
            Proficiency with a {weapon.name} allows you to add your proficiency bonus to the attack roll for any attack you make with it.
            <br /><br />
            This weapon has the following mastery property. To use this property, you must have a feature that lets you use it.
            <br /><br />
            <em><strong>{masteryProperty?.property.name}: </strong></em> {masteryProperty?.property.desc}
            <br /><br />
            </p>
          </div>
          {/* Since I have yet to dig through phb.standalone.css (in /themes/V3) and figure out how to stop having the columns, 
              we have the breakwall, something to keep the sea of extra space separate from my beautiful
              harbor of actual text */}
          <br /><br /><br /><br /><br /><br />
          <div className="wide">
            <table>
              <thead>
                <tr>
                  <th><strong>Name</strong></th>
                  <th><strong>Damage</strong></th>
                  <th><strong>Properties</strong></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{weapon.name}</td>
                  <td>{weapon.damage_dice} {weapon.damage_type.name}</td>
                  <td>{propertyNames}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
