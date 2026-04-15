import { Container } from "react-bootstrap";
import classJson from "../../../data/classes/bard.json";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { useEffect, useState } from "react";
import "./phb.standalone.css";
import "./Page.css";
import { useParams } from "react-router";
import { CharacterClass } from "../../modules/open5e/types.gen";
import { classesRetrieve } from "../../modules/open5e/sdk.gen";

const char = classJson;

async function parseMarkdown(markdown: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}
type ParsedContent = {
  table: string;
  desc: string;
};

export default function ClassPage() {
  let { stub } = useParams();

  const [charClass, setClass] = useState<CharacterClass | null>(null);

  const [content, setContent] = useState<ParsedContent>({
    table: "",
    desc: "",
  });

  useEffect(() => {
    let cancelled = false;

    async function parseAll() {
      const [table, desc] = await Promise.all([
        parseMarkdown(char.table ?? ""),
        parseMarkdown(char.desc ?? ""),
      ]);

      if (!cancelled) {
        setContent({
          table,
          desc,
        });
      }
    }
    parseAll();

    return () => {
      cancelled = true;
    };
  }, [stub]);

  useEffect(() => {
    async function load() {
      const resClass = await classesRetrieve({
        path: {
          key: stub || "",
        },
      });
      setClass(resClass.data as CharacterClass);
    }
    load();
  }, [stub]);
  console.log({ charClass });
  if (!charClass) {
    return (
      <div>
        <p>...loading</p>
      </div>
    );
  } else {
    return (
      <Container className="phb page soft">
        <h1>Class</h1>
        <div className="columnWrapper" id="p2" data-index="1">
          <h2>{charClass.name}</h2>
          <div
            className="classDescription"
            // dangerouslySetInnerHTML={{ __html: content.desc }}
          >
            {charClass.desc}
          </div>
          <div
            className="wide classTable"
            // dangerouslySetInnerHTML={{ __html: content.table }}
          />
          {charClass.name}
        </div>
        <a className="artist" href={char.document__url}>
          {char.document__slug}
        </a>
        <div className="footnote">
          <p className="">{char.document__title}</p>
        </div>
        <div className="pageNumber auto"></div>
      </Container>
    );
  }
}
