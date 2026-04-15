import { useEffect, useState } from "react";
import {
  Button,
  Col,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "react-bootstrap";
import {
  armorList,
  classesList,
  creaturesList,
  itemsList,
  spellsList,
  weaponsList,
} from "../../modules/open5e/sdk.gen";
import { Link } from "react-router";

const listFunctions = {
  creatures: creaturesList,
  spells: spellsList,
  items: itemsList,
  armor: armorList,
  weapons: weaponsList,
  classes: classesList,
};

type Category = keyof typeof listFunctions;

interface ListableItem {
  key: string;
  name: string;
}

type AnyPaginatedList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ListableItem[];
};

export default function Sidebar() {
  const [category, setCategory] = useState("creatures");
  const [data, setData] = useState<AnyPaginatedList | null>(null);
  let isSubClass = false;

  if (category === "classes") {
    isSubClass = false;
  } else if (category === "subclasses") {
    isSubClass = true;
  }

  const handleSelect = async (category: string) => {
    const result = await listFunctions[category as Category]({
      query: {
        page: 1,
        document__key__in: ["srd-2014", "srd-2024"],
        is_subclass: isSubClass,
      },
    });
    setData(result.data as AnyPaginatedList);
  };

  useEffect(() => {
    handleSelect(category);
  }, [category]);

  if (!data) {
    return (
      <div>
        <p>...loading</p>
      </div>
    );
  } else {
    return (
      <>
        <Col>
          <input type="checkbox" id="toggle-left" className="toggle-hidden" />
          <label htmlFor="toggle-left" className="side-tab left-tab">
            Library ◀
          </label>
          <aside className="sidebar sidebar-left">
            <input
              type="radio"
              name="lib-tab"
              id="lib-mon"
              className="lib-state"
              checked
            />
            <input
              type="radio"
              name="lib-tab"
              id="lib-spell"
              className="lib-state"
            />
            <input
              type="radio"
              name="lib-tab"
              id="lib-item"
              className="lib-state"
            />
            <input
              type="radio"
              name="lib-tab"
              id="lib-char"
              className="lib-state"
            />
            <DropdownButton
              id="sidebar-dropdown-selection"
              title={category.charAt(0).toUpperCase() + category.slice(1)}
              onSelect={(key) => {
                if (key) {
                  setCategory(key as Category);
                  handleSelect(key as Category);
                }
              }}
            >
              <DropdownMenu>
                <DropdownItem eventKey="armor">Armor</DropdownItem>
                <DropdownItem eventKey="Backgrounds">Backgrounds</DropdownItem>
                <DropdownItem eventKey="classes">Classes</DropdownItem>
                <DropdownItem eventKey="subclasses">Subclasses</DropdownItem>
                <DropdownItem>Conditions</DropdownItem>
                <DropdownItem>Documents</DropdownItem>
                <DropdownItem>Feats</DropdownItem>
                <DropdownItem>Magic Items</DropdownItem>
                <DropdownItem eventKey="creatures">Creatures</DropdownItem>
                <DropdownItem>Planes</DropdownItem>
                <DropdownItem>Races</DropdownItem>
                <DropdownItem>Sections</DropdownItem>
                <DropdownItem>Spell Lists</DropdownItem>
                <DropdownItem eventKey="spells">Spells</DropdownItem>
                <DropdownItem eventKey="weapons">Weapons</DropdownItem>
              </DropdownMenu>
            </DropdownButton>

            {/* <div className="library-nav"> */}
            {/*   <label htmlFor="lib-mon">Monsters</label> */}
            {/*   <label htmlFor="lib-spell">Spells</label> */}
            {/*   <label htmlFor="lib-item">Items</label> */}
            {/*   <label htmlFor="lib-char">Chars</label> */}
            {/* </div> */}

            <div className="library-content">
              <div className="content-pane pane-monsters">
                <ul className="list">
                  {data?.results.map((creature) => (
                    <li>
                      <Link to={`/encounter/${category}/` + creature.key}>
                        <Button variant="outline-info" size="sm">
                          {creature.name}
                        </Button>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="content-pane pane-spells">
                <h4>Spells</h4>
                <ul className="list">
                  <li>Fireball</li>
                  <li>Magic Missile</li>
                </ul>
              </div>
              <div className="content-pane pane-items">
                <h4>Items</h4>
                <ul className="list">
                  <li>Vorpal Sword</li>
                  <li>Bag of Holding</li>
                </ul>
              </div>
              <div className="content-pane pane-chars">
                <h4>Characters</h4>
                <ul className="list">
                  <li>Gandalf</li>
                  <li>Legolas</li>
                </ul>
              </div>
            </div>
          </aside>
        </Col>
      </>
    );
  }
}
