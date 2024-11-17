"use client";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { useServerMemory } from "@/hooks/memory";

type SliderProps = React.ComponentProps<typeof Slider>;

export function MemorySlider({ className, ...props }: SliderProps) {
  const { memory, setMemory } = useServerMemory();
  return (
    <div className="flex gap-2 col-span-3">
      <p className="w-14">{memory} GB</p>
      <Slider
        defaultValue={[memory]}
        max={16}
        step={1}
        onValueChange={(value) => {
          setMemory(value[0]);
          console.log(value);
        }}
        className={cn("w-[100%]", className)}
        {...props}
      />
    </div>
  );
}
