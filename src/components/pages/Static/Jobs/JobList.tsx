"use client";

import { useState } from "react";
import { ArrowUpRight, Briefcase, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { JobOpening } from "@/data/pages/jobsData";

const ALL_DEPARTMENTS = "All";

interface JobListProps {
  jobs: JobOpening[];
}

export default function JobList({ jobs }: JobListProps) {
  const [department, setDepartment] = useState(ALL_DEPARTMENTS);
  const departments = [ALL_DEPARTMENTS, ...new Set(jobs.map((job) => job.department))];
  const visibleJobs = department === ALL_DEPARTMENTS ? jobs : jobs.filter((job) => job.department === department);

  return (
    <div>
      <div role="tablist" aria-label="Departments" className="no-scrollbar mb-8 flex gap-2 overflow-x-auto">
        {departments.map((name) => (
          <button
            key={name}
            type="button"
            role="tab"
            aria-selected={department === name}
            onClick={() => setDepartment(name)}
            className={`shrink-0 rounded-full px-5 py-2 text-[14px] transition-colors duration-300 ease-smooth ${
              department === name ? "bg-ink text-white" : "border border-line bg-surface text-ink hover:border-ink"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <ul className="flex flex-col gap-4">
        {visibleJobs.map(({ id, title, department: team, location, type, summary }) => (
          <li key={id}>
            <a
              href={`mailto:${siteConfig.contact.careersEmail}?subject=${encodeURIComponent(`Application: ${title}`)}`}
              className="group flex flex-col gap-4 rounded-card border border-line-light bg-surface p-6 shadow-soft transition-colors hover:border-accent md:flex-row md:items-center md:p-8"
            >
              <div className="flex-1">
                <p className="text-[13px] font-semibold uppercase tracking-wider text-accent">{team}</p>
                <h3 className="mt-1 text-[21px] font-semibold tracking-tight text-ink">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{summary}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-[14px] text-ink-muted">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={16} />
                    {location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase size={16} />
                    {type}
                  </span>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[15px] font-medium text-accent">
                Apply now
                <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
