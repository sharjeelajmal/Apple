'use client';

import { useState, type FormEvent } from 'react';

type PriceRange = { minPrice: string | null; maxPrice: string | null };

interface PriceFilterFormProps {
  initialMin: string;
  initialMax: string;
  highestPrice: number;
  onApply: (range: PriceRange) => void;
}

const MAX_PRICE_DIGITS = 6;

export default function PriceFilterForm({ initialMin, initialMax, highestPrice, onApply }: PriceFilterFormProps) {
  const [minPrice, setMinPrice] = useState(initialMin);
  const [maxPrice, setMaxPrice] = useState(initialMax);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      setError('"From" must be less than "To".');
      return;
    }
    setError('');
    onApply({ minPrice: minPrice || null, maxPrice: maxPrice || null });
  };

  const fields = [
    { id: 'price-from', label: 'From', value: minPrice, setValue: setMinPrice, placeholder: '0' },
    { id: 'price-to', label: 'To', value: maxPrice, setValue: setMaxPrice, placeholder: String(highestPrice) },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {fields.map(({ id, label, value, setValue, placeholder }) => (
        <div key={id} className="flex flex-col">
          <label htmlFor={id} className="text-[13px] text-[#6e6e73] mb-1.5 font-medium">{label}</label>
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1a6] font-medium transition-colors group-focus-within:text-[#0071e3]">$</span>
            <input
              id={id}
              type="text"
              inputMode="numeric"
              placeholder={placeholder}
              value={value}
              onChange={(event) => {
                setValue(event.target.value.replace(/\D/g, '').slice(0, MAX_PRICE_DIGITS));
                setError('');
              }}
              className="w-full bg-gray-50 border border-gray-200 py-2.5 pl-7 pr-3 focus:border-[#0071e3] focus:bg-white outline-none text-[14px] rounded-lg transition-all text-[#1d1d1f]"
            />
          </div>
        </div>
      ))}
      {error && <p role="alert" className="text-[13px] text-[#e30000]">{error}</p>}
      <button
        type="submit"
        className="bg-[#1d1d1f] hover:bg-[#333336] text-white rounded-lg text-[14px] font-medium py-[10px] px-[20px] transition-colors mt-2 text-center w-full shadow-sm hover:shadow-md"
      >
        Filter Results
      </button>
    </form>
  );
}
