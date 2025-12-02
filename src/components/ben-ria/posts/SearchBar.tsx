interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export default function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="mb-6">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-6 py-3 rounded-full border border-black/20 
                 text-black placeholder:text-black/40
                 focus:border-black focus:outline-none transition-colors"
      />
    </div>
  );
}
