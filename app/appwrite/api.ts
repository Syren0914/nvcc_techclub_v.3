import { databases } from "./config";
import { Milestone, TeamMember } from '../types/team';


export const fetchTeamMembers = async () => {
    try{
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_DB_ID!, 
          process.env.NEXT_PUBLIC_TEAM_COLLECTION_ID!);
        

    // Map the fetched documents to your TeamMember type
    const teamMembers: TeamMember[] = response.documents.map((doc) => ({
        name: doc.name,
        role: doc.role,
        bio: doc.bio,
        image: doc.image,
        year: doc.year,
        contact: doc.contact,
        specialties: doc.specialties,
        github: doc.github,
        linkedin: doc.linkedin,
      }));
    
  
      console.log("Connection successful!", teamMembers);
      return teamMembers;
    } catch (error) {
      console.error("Error connecting to Appwrite:", error);
      return null;
    }

    
    
  
};

export const fetchMilestones = async () => {
  try{
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DB_ID!, 
        process.env.NEXT_PUBLIC_MILESTONE_COLLECTION_ID!);
      

  // Map the fetched documents to your TeamMember type
  const milestone: Milestone[] = response.documents.map((doc) => ({
      year: doc.year,
      title: doc.title,
      description: doc.description,
      
    }));
  

    console.log("Connection successful!", milestone);
    return milestone;
  } catch (error) {
    console.error("Error connecting to Appwrite:", error);
    return null;
  }

  
  

};