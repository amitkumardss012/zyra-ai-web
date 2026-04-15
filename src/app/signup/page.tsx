import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function SelectPreferencePage() {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="mx-auto flex h-full w-full max-w-2xl flex-col px-4 py-6">
        <div className="mb-4 text-center">
          <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Tell us about yourself
          </h1>
          <p className="mt-1 text-pretty text-sm text-muted-foreground">
            We’ll tailor your experience to match your goals and routine. This
            only takes a minute.
          </p>
        </div>

        <div className="flex-1 rounded-2xl border bg-card/60 p-4 shadow-sm backdrop-blur supports-backdrop-filter:bg-card/50 sm:p-6">
          <div className="flex h-full flex-col justify-between gap-4">
            <section className="space-y-2">
              <div className="space-y-1">
                <h2 className="text-base font-semibold">Preferred mode</h2>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Choose the plan that best fits how you’ll use Zyra.
                </p>
              </div>

              <RadioGroup defaultValue="plus" className="grid gap-2">
                <FieldLabel htmlFor="plus-plan">
                  <Field orientation="horizontal" className="rounded-xl border bg-background/60 px-3 py-2.5 transition-colors hover:bg-accent/40">
                    <FieldContent>
                      <FieldTitle>Plus</FieldTitle>
                      <FieldDescription className="hidden sm:block">
                        Great for individuals and small teams.
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value="plus" id="plus-plan" />
                  </Field>
                </FieldLabel>

                <FieldLabel htmlFor="pro-plan">
                  <Field orientation="horizontal" className="rounded-xl border bg-background/60 px-3 py-2.5 transition-colors hover:bg-accent/40">
                    <FieldContent>
                      <FieldTitle>Pro</FieldTitle>
                      <FieldDescription className="hidden sm:block">
                        Built for growing businesses.
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value="pro" id="pro-plan" />
                  </Field>
                </FieldLabel>
              </RadioGroup>
            </section>

            <section className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-base font-semibold">Age</h2>
                <span className="rounded-md border bg-background px-2 py-1 text-xs text-muted-foreground">
                  33
                </span>
              </div>

              <div className="rounded-xl border bg-background/60 px-3 py-3">
                <Slider defaultValue={[33]} max={100} min={18} step={1} />
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>18</span>
                  <span>100</span>
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <div className="space-y-1">
                <h2 className="text-base font-semibold">Gender</h2>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Optional. Helps refine health and nutrition insights.
                </p>
              </div>

              <RadioGroup defaultValue="male" className="grid grid-cols-3 gap-2">
                <div className="flex items-center justify-center gap-2 rounded-xl border bg-background/60 px-2 py-2.5">
                  <RadioGroupItem value="male" id="gender-male" />
                  <Label htmlFor="gender-male" className="cursor-pointer text-sm">
                    Male
                  </Label>
                </div>
                <div className="flex items-center justify-center gap-2 rounded-xl border bg-background/60 px-2 py-2.5">
                  <RadioGroupItem value="female" id="gender-female" />
                  <Label htmlFor="gender-female" className="cursor-pointer text-sm">
                    Female
                  </Label>
                </div>
                <div className="flex items-center justify-center gap-2 rounded-xl border bg-background/60 px-2 py-2.5">
                  <RadioGroupItem value="other" id="gender-other" />
                  <Label htmlFor="gender-other" className="cursor-pointer text-sm">
                    Other
                  </Label>
                </div>
              </RadioGroup>
            </section>

            <div className="pt-1">
              <Button className="w-full">Proceed</Button>
              <p className="mt-2 hidden text-center text-xs text-muted-foreground sm:block">
                You can update these preferences anytime in settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
