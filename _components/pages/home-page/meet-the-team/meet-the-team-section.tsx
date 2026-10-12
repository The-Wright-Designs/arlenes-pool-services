import SectionHeading from "@/_components/ui/section-headings";
import MeetTheTeamSlider from "./meet-the-team-slider";
import { fetchTeamData } from "@/_actions/wordpress-actions";

const MeetTheTeamSection = async () => {
  const teamData = await fetchTeamData();

  return (
    <section className="flex flex-col gap-10 px-5 py-10 tablet:px-10 overflow-hidden desktop:py-5">
      <SectionHeading>Meet The Team</SectionHeading>
      <div className="tablet:overflow-hidden">
        <MeetTheTeamSlider data={teamData} cssClasses="w-full" />
      </div>
    </section>
  );
};

export default MeetTheTeamSection;
