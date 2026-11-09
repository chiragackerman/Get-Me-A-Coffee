"use client";

import { useState } from "react";

const coffeeQuantities = [1, 2, 3, 5, 10];
const coffeePrice = 20;

export default function BuyThemCoffee() {
  const [quantity, setQuantity] = useState(coffeeQuantities[0]);
  const total = quantity * coffeePrice;

  return (
    <section
      aria-labelledby="buy-coffee-title"
      className="rounded-2xl border border-coffee-border bg-warm-white p-6 shadow-sm sm:p-7"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            id="buy-coffee-title"
            className="font-heading text-2xl font-bold text-espresso"
          >
            Buy Them a Coffee
          </h2>
          <p className="mt-1 text-sm leading-6 text-mocha">
            Support this creator and help them keep creating.
          </p>
        </div>
        <p className="text-sm font-semibold text-coffee">₹20 per coffee</p>
      </div>

      <fieldset className="mt-6">
        <legend className="mb-3 text-sm font-semibold text-espresso">
          Choose a quantity
        </legend>
        <div className="grid grid-cols-5 gap-2 sm:max-w-md sm:gap-3">
          {coffeeQuantities.map((amount) => (
            <button
              aria-pressed={quantity === amount}
              className={`rounded-xl border px-2 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coffee ${
                quantity === amount
                  ? "border-coffee bg-coffee text-warm-white"
                  : "border-coffee-border bg-cream text-espresso hover:bg-latte"
              }`}
              key={amount}
              onClick={() => setQuantity(amount)}
              type="button"
            >
              {amount}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 flex flex-col gap-4 border-t border-coffee-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className="text-lg font-semibold text-espresso">
          Total: ₹{total}
        </p>
        <button
          className="rounded-full bg-coffee px-7 py-3 font-semibold text-warm-white opacity-70"
          disabled
          title="Payments are not available yet"
          type="button"
        >
          Buy Coffee
        </button>
      </div>
    </section>
  );
}
