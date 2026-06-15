interface PhoneInputProps {
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  placeholder?: string;
  title?: string;
  className?: string;
}

const PREFIX = "+46";

function extractLocal(value: string): string {
  let v = value.trim();
  if (v.startsWith(PREFIX)) v = v.slice(PREFIX.length);
  v = v.replace(/\D/g, "");
  while (v.startsWith("0")) v = v.slice(1);
  return v.slice(0, 9);
}

export default function PhoneInput({
  value,
  onChange,
  required,
  placeholder,
  title,
  className,
}: PhoneInputProps) {
  const local = extractLocal(value);

  const handleChange = (raw: string) => {
    const digits = extractLocal(raw);
    onChange(digits ? `${PREFIX}${digits}` : "");
  };

  return (
    <div
      dir="ltr"
      className={`flex items-stretch rounded-xl bg-white/5 border border-white/10 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30 transition-colors overflow-hidden ${className ?? ""}`}
    >
      <span className="flex items-center px-3 text-white/60 bg-white/[0.04] border-r border-white/10 select-none">
        {PREFIX}
      </span>
      <input
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        dir="ltr"
        pattern="[1-9][0-9]{8}"
        maxLength={9}
        required={required}
        placeholder={placeholder}
        title={title}
        value={local}
        onChange={(e) => handleChange(e.target.value)}
        className="flex-1 px-3 py-3 bg-transparent text-white placeholder-white/30 focus:outline-none"
      />
    </div>
  );
}
