import { Separator } from "./ui/separator"


export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg border flex items-center justify-center font-semibold">
              P
            </div>
            <div>
              <div className="text-sm font-semibold leading-none">PMS</div>
              <div className="text-xs text-muted-foreground">Project Management System</div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">&nbsp;</div>
        </div>
      </div>
      <Separator />
    </header>
  )
}
