import { createRoot } from "react-dom/client"
import { RailToc, type RailTocItem } from "./rail-toc"

const items: RailTocItem[] = [
  { id: "overview", label: "Overview" },
  { id: "why", label: "The problem", depth: 1 },
  { id: "product", label: "Product", depth: 1 },
  { id: "hardware", label: "Hardware", depth: 1 },
  { id: "evaluation", label: "Evaluation", depth: 1 },
  { id: "market", label: "Market", depth: 1 },
  { id: "roadmap", label: "Roadmap", depth: 1 },
  { id: "recognition", label: "Recognition", depth: 1 },
  { id: "team", label: "Team" },
]

const mount = document.getElementById("route-rail")

if (mount) {
  createRoot(mount).render(<RailToc items={items} title="Route guide" offset={100} indent={9} />)
}
