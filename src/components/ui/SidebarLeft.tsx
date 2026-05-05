import "../../styles/Style.css";
import { useEffect, useState } from "react";
import {
  DropdownButton,
  DropdownItem,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router";
import {
  categories,
  getCategory,
  warmAll,
  type Category,
} from "../../modules/open5e-cache";

interface ListableItem {
  key: string;
  name: string;
}

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LeftSidebar({ isOpen, onClose }: SidebarProps) {
  const [category, setCategory] = useState<Category>("creatures");
  const [items, setItems] = useState<ListableItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      let result = await getCategory(category);
      if (!result) {
        await warmAll();
        result = await getCategory(category);
      }
      if (!cancelled) {
        setItems((result?.entries ?? []) as ListableItem[]);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [category]);

  const currentLabel =
    categories.find((c) => c.key === category)?.label ?? category;

  return (
    <aside
      id="sidebar-left"
      className={`sidebar sidebar-left${isOpen ? " open" : ""}`}
      aria-hidden={!isOpen}
    >
      <DropdownButton
        id="sidebar-dropdown-selection"
        title={currentLabel}
        onSelect={(key) => {
          if (key) setCategory(key as Category);
        }}
      >
        {categories.map(({ key, label }) => (
          <DropdownItem key={key} eventKey={key}>
            {label}
          </DropdownItem>
        ))}
      </DropdownButton>

      <div className="library-content">
        {items === null ? (
          <div className="text-center py-3">
            <Spinner animation="border" size="sm" /> Loading…
          </div>
        ) : items.length === 0 ? (
          <p className="text-center py-3">No entries</p>
        ) : (
          <ListGroup variant="flush" className="library-list">
            {items.map((item) => (
              <ListGroup.Item
                key={item.key}
                action
                as={Link}
                to={`/encounter/${category}/${item.key}`}
                onClick={onClose}
              >
                {item.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
    </aside>
  );
}
