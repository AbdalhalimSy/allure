"use client";

import { useMemo } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AccountLayout from "@/components/account/AccountLayout";
import AccountSection from "@/components/account/AccountSection";
import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { getAccountNavItems } from "@/lib/utils/accountNavItems";

const experiences = [
  {
    id: 1,
    title: "Creative Director",
    company: "Allure Studios",
    location: "Los Angeles, CA",
    period: "2020 - Present",
    description: "Leading creative vision and strategy for high-profile entertainment projects. Managing a team of 15+ designers and coordinating with production teams.",
  },
  {
    id: 2,
    title: "Senior Art Director",
    company: "MediaWorks Inc.",
    location: "New York, NY",
    period: "2017 - 2020",
    description: "Directed visual concepts for major brand campaigns. Collaborated with clients to deliver innovative design solutions.",
  },
  {
    id: 3,
    title: "Art Director",
    company: "Creative Agency",
    location: "San Francisco, CA",
    period: "2014 - 2017",
    description: "Managed design projects from concept to completion. Worked on diverse projects across digital and print media.",
  },
];

export default function ExperiencePage() {
  const { user } = useAuth();
  const navItems = useMemo(() => getAccountNavItems(user?.profile), [user?.profile]);

  return (
    <ProtectedRoute requireAuth={true}>
      <AccountLayout navItems={navItems}>
        <AccountSection
          title="Work Experience"
          description="Showcase your professional journey and achievements"
        >
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {exp.title}
                    </h3>
                    <p className="mt-1 font-medium text-[#c49a47]">{exp.company}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                        {exp.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                        {exp.period}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                      {exp.description}
                    </p>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <button className="rounded-lg p-2 text-gray-600 hover:bg-white hover:text-[#c49a47] dark:text-gray-400 dark:hover:bg-black">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </button>
                    <button className="rounded-lg p-2 text-gray-600 hover:bg-white hover:text-rose-600 dark:text-gray-400 dark:hover:bg-black">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center border-t border-gray-200 pt-6 dark:border-white/10">
            <Button variant="secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-2 h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Experience
            </Button>
          </div>
        </AccountSection>
      </AccountLayout>
    </ProtectedRoute>
  );
}
