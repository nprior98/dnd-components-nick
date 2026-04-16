import { Container } from "react-bootstrap";
import { spellsRetrieve } from "../../modules/open5e/sdk.gen";
import { Spell } from "../../modules/open5e/types.gen";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function SpellPage() {
  let { stub } = useParams();
  const [spell, setSpell] = useState<Spell | null>(null);

  useEffect(() => {
    async function load() {
      const res = await spellsRetrieve({
        path: {
          key: stub || "",
        },
      });
      console.log(res.data);
      setSpell(res.data as Spell);
    }
    load();
  }, [stub]);

  if (!spell) {
    return (
      <div>
        <p>...loading</p>
      </div>
    );
  } else {
    return (
      <Container className="phb page auto">
        <main className="" id="p1" data-index="0">
          <h1>Spell</h1>
          <div className="columnWrapper">
            <h2 id="spell" className="">
              {spell.name}
            </h2>
            <p className="wide">
              <em>
                Level {spell.level} {spell.school.name}
              </em>
            </p>
            <ul className="wide">
              <li>
                <strong>Casting Time: </strong>
                {spell.casting_time}
              </li>
              <li>
                <strong>Components: </strong>
                {spell.verbal ? " V " : ""}
                {spell.somatic ? " S " : ""}
                {spell.material ? `M (${spell.material_specified})` : ""}
              </li>
              <li>
                <strong>Duration: </strong>
                {spell.duration != "" ? spell.duration : ""}
              </li>
            </ul>
            <p className="wide">{spell.desc}</p>
            <dl className="">
              {spell.casting_options.map((option) => (
                <>
                  <dt>{option.type}</dt>
                  <dd>
                    {option.damage_roll != null ? (
                      <li>Damage Roll: {option.damage_roll}</li>
                    ) : null}
                    {option.desc != null ? <li>{option.desc}</li> : null}
                    {option.target_count != null ? (
                      <li>Target Count: {option.target_count}</li>
                    ) : null}
                    {option.duration != null ? (
                      <li>Duration: {option.duration}</li>
                    ) : null}
                    {option.range != null ? (
                      <li>Range: {option.range}</li>
                    ) : null}
                    {option.shape_size != null ? (
                      <li>Shape/Size:{option.shape_size}</li>
                    ) : null}
                    {option.concentration != null ? (
                      <li>Concentration: {option.concentration}</li>
                    ) : null}
                  </dd>
                  <br />
                </>
              ))}
            </dl>
          </div>
          <a className="artist" href={spell.document.permalink}>
            {spell.document.publisher.name}
          </a>
          <div className="footnote">
            <p className="">{spell.document.name}</p>
          </div>
          <div className="pageNumber auto"></div>
        </main>
      </Container>
    );
  }
}
