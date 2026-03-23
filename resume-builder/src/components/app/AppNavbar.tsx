"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faGear,
  faLocationDot,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import { faCircleQuestion, faFolderOpen } from "@fortawesome/free-regular-svg-icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatefulButton } from "@/components/ui/stateful-button";
import { useSupport } from "@/context/SupportContext";

type Props = {
  userEmail?: string | null;
};

function initialsFromEmail(email?: string | null) {
  const v = (email ?? "").trim();
  if (!v) return "U";
  const name = v.split("@")[0] ?? "";
  const parts = name.split(/[._\s-]+/).filter(Boolean);
  const first = parts[0]?.[0] ?? name[0] ?? "";
  const second = parts.length > 1 ? parts[1]?.[0] : (name[1] ?? "");
  const out = `${first}${second}`.toUpperCase();
  return out.trim() ? out : "U";
}

export function AppNavbar({ userEmail }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openSupport } = useSupport();

  const initials = useMemo(() => initialsFromEmail(userEmail), [userEmail]);
  const activeTab = searchParams.get("tab") ?? "home";

  const logout = useCallback(async () => {
    // Server expects POST /auth/logout and will clear Supabase session.
    await fetch("/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/");
  }, [router]);

  const navItems = useMemo(
    () => [
      { key: "home", label: "Home", href: "/app?tab=home" },
      { key: "files", label: "Your files", href: "/app?tab=files" },
      { key: "tracker", label: "Tracker", href: "/app?tab=tracker" },
    ],
    [],
  );

  const isActive = (key: string) => activeTab === key;

  const byPrefixAndName = useMemo(
    () => ({
      fausb: { house: faHouse },
      fad: { "folder-open": faFolderOpen },
      fas: { "location-dot": faLocationDot, gear: faGear },
      far: { coins: faCoins, gear: faGear, "circle-question": faCircleQuestion },
    }),
    [],
  );

  const iconForKey = (key: string) => {
    switch (key) {
      case "home":
        return (
          <FontAwesomeIcon icon={byPrefixAndName.fausb["house"]} className="h-5 w-5" />
        );
      case "files":
        return (
          <FontAwesomeIcon
            icon={byPrefixAndName.fad["folder-open"]}
            className="h-5 w-5"
          />
        );
      case "tracker":
        return (
          <FontAwesomeIcon
            icon={byPrefixAndName.fas["location-dot"]}
            className="h-5 w-5"
          />
        );
      case "settings":
        return (
          <FontAwesomeIcon icon={byPrefixAndName.fas["gear"]} className="h-5 w-5" />
        );
      default:
        return null;
    }
  };

  const mobileNavItems = useMemo(
    () => [
      { key: "home", href: "/app?tab=home" },
      { key: "files", href: "/app?tab=files" },
      { key: "tracker", href: "/app?tab=tracker" },
    ],
    [],
  );

  const ProfileDropdown = ({ triggerId }: { triggerId: string }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          id={triggerId}
          type="button"
          className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-zinc-200 text-zinc-700 transition-colors hover:bg-zinc-300"
          aria-label="Profile menu"
        >
          <span className="text-xs font-semibold">{initials}</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 !border-[rgb(222,222,222)] !bg-white !text-zinc-950 !rounded-[17.5px] dark:!bg-white dark:!text-zinc-950"
      >
        <DropdownMenuLabel className="flex items-center justify-between gap-3">
          <span className="min-w-0 max-w-[10rem] truncate">{userEmail ?? "Unknown"}</span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-normal text-zinc-700">
            unavailble
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "rgb(252, 189, 195)" }}
            />
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => {
            void router.push("/app?tab=subscription");
          }}
          className="!bg-white !text-zinc-950 hover:!bg-zinc-100 hover:!text-zinc-950 focus:!bg-zinc-100 focus:!text-zinc-950"
        >
          Subscription
          <FontAwesomeIcon icon={byPrefixAndName.far["coins"]} className="ml-auto h-4 w-4" />
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => {
            void router.push("/app?tab=settings");
          }}
          className="!bg-white !text-zinc-950 hover:!bg-zinc-100 hover:!text-zinc-950 focus:!bg-zinc-100 focus:!text-zinc-950"
        >
          Settings
          <FontAwesomeIcon icon={byPrefixAndName.far["gear"]} className="ml-auto h-4 w-4" />
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => {
            openSupport();
          }}
          className="sm:hidden !bg-white !text-zinc-950 hover:!bg-zinc-100 hover:!text-zinc-950 focus:!bg-zinc-100 focus:!text-zinc-950"
        >
          Submit a ticket
          <FontAwesomeIcon
            icon={byPrefixAndName.far["circle-question"]}
            className="ml-auto h-4 w-4"
          />
        </DropdownMenuItem>

        <div className="px-2 pb-1 pt-2">
          <StatefulButton onClick={() => void logout()} className="!bg-black hover:!bg-zinc-900">
            Log out
          </StatefulButton>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden sm:flex mx-auto w-full max-w-6xl px-4 pt-[0.8rem] items-center justify-between gap-3">
        {/* Detached logo on the left */}
        <Link
          href="/app"
          aria-label="ResumeFX logo"
          className="flex h-[4.5rem] w-[4.5rem] items-center justify-center bg-transparent"
        >
          <Image
            src="/fix_my_resume_icon.svg"
            alt="ResumeFX logo"
            width={72}
            height={72}
            className="h-[4.5rem] w-[4.5rem]"
            priority
          />
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-between rounded-full bg-white px-3 h-11">
          <nav className="flex min-w-0 items-center gap-2 font-[var(--font-lexend-deca)]">
            {navItems.map((item) => {
              const active = isActive(item.key);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={[
                    "rounded-full px-4 h-[34px] flex items-center justify-center text-sm transition-colors",
                    active
                      ? "bg-zinc-950 text-white"
                      : "text-zinc-900 hover:bg-zinc-950 hover:text-white",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ProfileDropdown triggerId="profile-menu-desktop" />
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="sm:hidden relative mx-auto w-full px-4 pt-[0.8rem]">
        <div className="flex justify-center">
          <Link
            href="/app"
            aria-label="ResumeFX logo"
              className="flex h-[4.5rem] w-[4.5rem] items-center justify-center bg-transparent"
          >
            <Image
              src="/fix_my_resume_icon.svg"
              alt="ResumeFX logo"
                width={72}
                height={72}
                className="h-[4.5rem] w-[4.5rem]"
              priority
            />
          </Link>
        </div>

      </div>

      {/* Mobile bottom bar */}
      <div className="sm:hidden fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4">
        {/* 4 items (3 tabs + profile) evenly distributed */}
        <div className="grid w-full grid-cols-4 items-center justify-items-center rounded-full bg-white px-3 py-2 shadow-lg">
          {mobileNavItems.map((item) => {
            const active = isActive(item.key);
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-label={item.key}
                className={[
                  "mx-auto flex h-[34px] w-[34px] items-center justify-center rounded-full transition-colors",
                  active
                    ? "bg-zinc-950 text-white"
                    : "text-zinc-900 hover:bg-zinc-950 hover:text-white",
                ].join(" ")}
              >
                {iconForKey(item.key)}
              </Link>
            );
          })}

          {/* PFP inside navbar when in mobile */}
          <div className="flex items-center justify-center">
            <ProfileDropdown triggerId="profile-menu-mobile" />
          </div>
        </div>
      </div>
    </>
  );
}

