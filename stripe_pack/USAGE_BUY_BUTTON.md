# Using the BuyButton

Replace your Payhip embed with:

```jsx
import BuyButton from "@/components/BuyButton";

export default function ProductCard() {
  return <BuyButton priceIds={["price_xxx"]} label="Buy Now – $16.99" />;
}
```

- If a bundle includes multiple Stripe Prices, pass them all:
```jsx
<BuyButton priceIds={["price_a", "price_b"]} label="Get the Bundle" />
```