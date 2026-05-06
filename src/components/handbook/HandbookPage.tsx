import type { ReactNode } from "react";
import "./phb-fonts.css";
import "../../../themes/V3/5ePHB/style.css";
import "./phb.standalone.css";
import "./Page.css";

type HandbookPageProps = {
  children: ReactNode;
  modifier?: "soft" | "auto";
};

export default function HandbookPage({
  children,
  modifier,
}: HandbookPageProps) {
  const className = ["phb", "page", modifier].filter(Boolean).join(" ");

  return (
    <div className="handbook-page-wrapper">
      <div className="handbook-page-scaler">
        <div className={className}>{children}</div>
      </div>
    </div>
  );
}
