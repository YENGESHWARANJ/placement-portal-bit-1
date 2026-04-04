import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center pt-40">

      <Command className="bg-zinc-900 rounded-2xl w-[520px] p-4 shadow-xl">

        <Command.Input
          placeholder="Search actions…"
          className="w-full bg-transparent outline-none text-slate-900 mb-4"
        />

        <Command.List>

          <Command.Item onSelect={() => navigate("/student/dashboard")}>
            Student Dashboard
          </Command.Item>

          <Command.Item onSelect={() => navigate("/admin/dashboard")}>
            Admin Console
          </Command.Item>

        </Command.List>

      </Command>
    </div>
  );
}
