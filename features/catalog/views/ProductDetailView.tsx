import { ProductDetailSection } from "../sections/ProductDetailSection";

type Props = { id: number };

export function ProductDetailView({ id }: Props) {
  return <ProductDetailSection id={id} />;
}
