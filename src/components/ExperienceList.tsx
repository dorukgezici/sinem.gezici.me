const experiences = [
  {
    role: "Performance Marketing Manager",
    company: "Rovio Entertainment",
    companyUrl: "https://www.rovio.com",
    period: "Oct 2024 — Present",
  },
  {
    role: "Performance Marketing Specialist",
    company: "Rovio Entertainment",
    companyUrl: "https://www.rovio.com",
    period: "Nov 2022 — Oct 2024",
  },
  {
    role: "Performance Marketing Specialist",
    company: "Masomo",
    companyUrl: "https://masomo.com",
    period: "Oct 2021 — Nov 2022",
  },
  {
    role: "Alumni / Fellow",
    company: "Turkish Entrepreneurship Foundation",
    companyUrl: "https://girisimcilikvakfi.org",
    period: "Oct 2019 — Present",
  },
  {
    role: "Digital Marketing Specialist",
    company: "Gamer Arena",
    companyUrl: "https://gamerarena.com",
    period: "Aug 2019 — Mar 2020",
  },
  {
    role: "Volunteer",
    company: "Young Guru Academy",
    companyUrl: "https://yga.org.tr",
    period: "Feb 2019 — Feb 2020",
  },
  {
    role: "Marketing & Growth Hacking Trainee",
    company: "Piri",
    companyUrl: "https://piriguide.com",
    period: "Jul 2019 — Aug 2019",
  },
];

export default function ExperienceList() {
  return (
    <div className="flex flex-col gap-2 md:gap-3">
      {experiences.map((exp, index) => (
        <div key={index} className="group">
          <h3 className="text-[9px] md:text-[10px] text-charcoal leading-relaxed">
            {exp.role}
          </h3>
          <a
            href={exp.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[8px] md:text-[9px] text-muted hover:text-coral transition-colors"
          >
            {exp.company}
          </a>
          <p className="text-[7px] md:text-[8px] text-muted/70 mt-0.5">{exp.period}</p>
        </div>
      ))}
    </div>
  );
}
