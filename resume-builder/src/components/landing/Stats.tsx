"use client";

import { NumberTicker } from "@/components/ui/number-ticker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faBuildingUser, faBriefcase } from "@fortawesome/free-solid-svg-icons";

export function Stats() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10 sm:px-16 lg:pl-[calc(6rem+25px)] lg:pr-24" style={{ fontFamily: "var(--font-google-sans), Arial, Helvetica, sans-serif" }}>
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-evenly sm:gap-0">
        <div className="flex flex-col items-center gap-2">
          <FontAwesomeIcon icon={faClock} className="h-8 w-8 text-slate-700" />
          <div className="text-center">
            <span className="text-[1.3rem] font-normal text-slate-900">
              <NumberTicker value={500} startValue={0} delay={0.2} />
              <span>hrs</span>
            </span>
            <p className="mt-1 text-[0.9rem] font-normal text-slate-600">saved</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <FontAwesomeIcon icon={faBuildingUser} className="h-8 w-8 text-slate-700" />
          <div className="text-center">
            <span className="text-[1.3rem] font-normal text-slate-900">
              <NumberTicker value={1000} startValue={0} delay={0.4} />
              <span>+</span>
            </span>
            <p className="mt-1 text-[0.9rem] font-normal text-slate-600">interviews</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <FontAwesomeIcon icon={faBriefcase} className="h-8 w-8 text-slate-700" />
          <div className="text-center">
            <span className="text-[1.3rem] font-normal text-slate-900">
              <NumberTicker value={500} startValue={0} delay={0.6} />
            </span>
            <p className="mt-1 text-[0.9rem] font-normal text-slate-600">jobs secured</p>
          </div>
        </div>
      </div>
    </section>
  );
}
