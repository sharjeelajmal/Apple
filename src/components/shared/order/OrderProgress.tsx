import { Check, Home, Package, Truck, type LucideIcon } from "lucide-react";
import { orderStatusLabels, type OrderStatus } from "@/types/order";

type ProgressStep = {
  status: OrderStatus;
  icon: LucideIcon;
};

const steps: ProgressStep[] = [
  { status: "placed", icon: Check },
  { status: "processing", icon: Package },
  { status: "shipped", icon: Truck },
  { status: "delivered", icon: Home },
];

interface OrderProgressProps {
  status: OrderStatus;
}

export default function OrderProgress({ status }: OrderProgressProps) {
  const currentStep = steps.findIndex((step) => step.status === status);

  return (
    <ol className="grid grid-cols-4">
      {steps.map(({ status: stepStatus, icon: Icon }, index) => {
        const isComplete = index <= currentStep;
        const isLast = index === steps.length - 1;

        return (
          <li key={stepStatus} className="relative flex flex-col items-center text-center">
            {!isLast && (
              <span
                aria-hidden
                className={`absolute left-1/2 top-5 h-0.5 w-full ${
                  index < currentStep ? "bg-positive" : "bg-line-light"
                }`}
              />
            )}
            <span
              className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                isComplete
                  ? "border-positive bg-positive text-white"
                  : "border-line-light bg-surface text-ink-subtle"
              }`}
            >
              <Icon size={18} />
            </span>
            <span
              className={`mt-3 text-[12px] sm:text-[14px] ${
                isComplete ? "font-semibold text-ink" : "text-ink-muted"
              }`}
            >
              {orderStatusLabels[stepStatus]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
