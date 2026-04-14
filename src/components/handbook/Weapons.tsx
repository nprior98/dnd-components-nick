import { useEffect, useState} from "react";
import { itemsRetrieve, weaponsRetrieve } from "../../modules/open5e/sdk.gen";
import { Item, Weapon } from "../../modules/open5e/types.gen"
import { useParams } from "react-router";




export default function WeaponPage() {
  
  let { stub } = useParams();

  //Not the most efficient way of doing it by ANY means, 
  //but it gets me the correct information
  const [item, setItem] = useState<Item | null>(null);
  const [weapon, setWeapon] = useState<Weapon | null>(null);

  useEffect(() => {
    async function load() {
      const resItem = await itemsRetrieve({
        path: {
          key: stub || "",
        }
      });
      const resWeapon = await weaponsRetrieve({
        path: {
          key: stub || "",
        }
      });
      setItem(resItem.data as Item);
      setWeapon(resWeapon.data as Weapon);
    }
    load();
  }, [stub]);
  
  
  
  if (!item) {
    return (
      <div>
        <p>...loading</p>
      </div>
    );
  } else {
    
    //True if the range is 0 or if it can be thrown
    const isMelee = weapon?.range == 0 || item.weapon.properties.some(
      properties => properties.property.name === "Thrown");
    
    //Stores the mastery property separately
    const masteryProperty = item.weapon.properties.find(
      properties => properties.property.type === "Mastery");
    
    //Stores all the property names and adds appropriate details 
    const propertyNames = item.weapon.properties.map((properties) => {
      if (properties.property.type === "Mastery"){
        //Do nothing
      } else if (properties.property.name != null) {
        switch (properties.property.name) {
          case "Thrown":
          //Left blank to roll into Versatile

          case "Versatile":
            
            return `${properties.property.name} (${properties.detail}), `;
        
          case "Ammunition":
            
            return `Ammunition (Range ${weapon?.range}/${weapon?.long_range}), `;
  
          default:
            return `${properties.property.name}, `;
        }}});
    propertyNames.push(masteryProperty?.property.name);
  
    
    return (
      <div className="phb page wide" id="p3" data-index="2">
        <h1>Weapon</h1>
        <div className="wide">
          <h2>{item.name}</h2>
          <div className="wide">
            <div className="wide">
              <strong>Type: </strong>{item.weapon.is_simple ? "Simple" : "Martial"} {isMelee ? "Melee" : "Ranged"} Weapon <br /><br />
              <p>
              Proficiency with a {item.name} allows you to add your proficiency bonus to the attack roll for any attack you make with it.
              <br />
              This weapon has the following mastery property. To use this property, you must have a feature that lets you use it.
              <br /><br />
              <em><strong>{masteryProperty?.property.name}: </strong></em> {masteryProperty?.property.desc}
              <br />
              </p>
            </div>
            <div className="wide">
              <table>
                <thead>
                  <tr>
                    <th><strong>Name</strong></th>
                    {/* <th><strong>Cost</strong></th> */}
                    <th><strong>Damage</strong></th>
                    {/* <th><strong>Weight</strong></th> */}
                    <th><strong>Properties</strong></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{item.name}</td>
                    {/* <td>{item.cost}</td> */}
                    <td>{item.weapon.damage_dice} {item.weapon.damage_type.name}</td>
                    {/* <td>{item.weight}</td> */}
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
  
}
