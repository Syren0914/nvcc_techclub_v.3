"use client";
import { useEffect, useState } from "react";

import { Milestone, TeamMember } from "../types/team";  // Make sure to import your TeamMember type
import { fetchTeamMembers , fetchMilestones } from "../appwrite/api";

const Team = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]); // Assuming you have a Milestone type as well

  useEffect(() => {
    const loadData = async () => {
      const teamData = await fetchTeamMembers(
      );
      if (teamData) {
        setTeam(teamData);
      }
    };
    loadData();
  }, []);

  return (
    <div>
      <h1>Team Members</h1>
      <ul>
        {team.map((member, idx) => (
          <li key={idx}>{member.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Team;
