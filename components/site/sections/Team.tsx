import Image from "next/image";
import { Mail } from "lucide-react";
import type { TeamMember } from "@prisma/client";
import type { SectionIntroContent } from "@/lib/types/sections";
import { SectionIntro } from "@/components/site/SectionIntro";

export function Team({
  content,
  members,
}: {
  content: SectionIntroContent;
  members: TeamMember[];
}) {
  if (members.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <SectionIntro {...content} />

      <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((member) => (
          <div key={member.id} className="text-center">
            <div className="relative mx-auto aspect-square w-full max-w-55 overflow-hidden rounded-2xl bg-navy-100">
              {member.photoUrl ? (
                <Image src={member.photoUrl} alt={member.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-navy-400">
                  {member.name.charAt(0)}
                </div>
              )}
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">{member.name}</h3>
            <p className="text-sm text-muted-foreground">{member.designation}</p>
            {member.qualification && (
              <p className="text-xs text-muted-foreground">{member.qualification}</p>
            )}
            <div className="mt-3 flex justify-center gap-3">
              {member.linkedinUrl && (
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-muted-foreground hover:text-primary"
                >
                  LinkedIn
                </a>
              )}
              {member.email && (
                <a href={`mailto:${member.email}`} className="text-muted-foreground hover:text-primary">
                  <Mail className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
