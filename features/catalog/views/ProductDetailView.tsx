import { ProductDetailSection } from "../sections/ProductDetailSection";

type Props = { id: string };

export function ProductDetailView({ id }: Props) {
  return <ProductDetailSection id={id} />;
}
