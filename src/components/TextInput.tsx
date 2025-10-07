interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TextInput({ value, onChange, disabled }: TextInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Or paste your legal text here
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Paste the legal document text here..."
        className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                 placeholder-gray-400 dark:placeholder-gray-500
                 disabled:opacity-50 disabled:cursor-not-allowed
                 resize-none"
      />
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {value.split(/\s+/).filter(Boolean).length} words
      </p>
    </div>
  );
}
