import { MIN_PASSWORD_LENGTH } from "@/lib/validators";

const rules = [
  { label: `${MIN_PASSWORD_LENGTH}+ characters`, test: (value: string) => value.length >= MIN_PASSWORD_LENGTH },
  { label: "Upper & lowercase", test: (value: string) => /[a-z]/.test(value) && /[A-Z]/.test(value) },
  { label: "A number", test: (value: string) => /\d/.test(value) },
];

const strengthColors = ["bg-line-light", "bg-danger", "bg-amber-400", "bg-positive"];

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const passedCount = rules.filter((rule) => rule.test(password)).length;

  return (
    <div className="px-1">
      <div className="flex gap-1.5">
        {rules.map((rule, index) => (
          <span
            key={rule.label}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              index < passedCount ? strengthColors[passedCount] : strengthColors[0]
            }`}
          />
        ))}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
        {rules.map((rule) => (
          <li key={rule.label} className={rule.test(password) ? "text-positive" : "text-ink-subtle"}>
            {rule.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
