import React, { useEffect, useState } from 'react';
import { supabaseService } from '@/services/supabaseService';

const ProjectDebug = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [specificProject, setSpecificProject] = useState<any>(null);

  useEffect(() => {
    const testProjects = async () => {
      try {
        console.log('ProjectDebug: Testing project fetching...');
        
        // Test getting all projects
        const allProjects = await supabaseService.getAllProjectsDebug();
        console.log('ProjectDebug: All projects:', allProjects);
        setProjects(allProjects);
        
        // Test getting the specific project that's failing
        const projectId = '45b4e834-0d43-4feb-9280-b1184bc2a943';
        console.log('ProjectDebug: Testing specific project ID:', projectId);
        const specific = await supabaseService.getProjectById(projectId);
        console.log('ProjectDebug: Specific project result:', specific);
        setSpecificProject(specific);
        
      } catch (error) {
        console.error('ProjectDebug: Error:', error);
      } finally {
        setLoading(false);
      }
    };

    testProjects();
  }, []);

  if (loading) {
    return <div className="text-white">Loading projects...</div>;
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h3 className="text-white text-lg mb-4">Project Debug Info</h3>
      
      <div className="text-white mb-4">
        <h4 className="font-bold">Specific Project Test (ID: 45b4e834-0d43-4feb-9280-b1184bc2a943)</h4>
        {specificProject ? (
          <div className="text-green-400">✅ Found project: {specificProject.title}</div>
        ) : (
          <div className="text-red-400">❌ Project not found</div>
        )}
      </div>
      
      <div className="text-white mb-2">Total projects: {projects.length}</div>
      {projects.map((project, index) => (
        <div key={project.id || index} className="text-white text-sm mb-2 p-2 bg-gray-700 rounded">
          <div>ID: {project.id}</div>
          <div>Title: {project.title}</div>
          <div>Artist ID: {project.artist_id}</div>
          <div>Type: {project.project_type}</div>
          <div>Status: {project.status}</div>
        </div>
      ))}
    </div>
  );
};

export default ProjectDebug; 